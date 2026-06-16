import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AuthContext } from '../../context/AuthContext';

const COLORS = {
  primary: '#C62828',
  primaryLight: '#FFEBEE',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  textPrimary: '#0A0A0A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0F0F0',
  borderFocus: '#C62828',
};

function GoogleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.7-.4-4z"/>
      <Path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.8 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z"/>
      <Path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.4l-6.6 5.1C9.6 39.6 16.3 44 24 44z"/>
      <Path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.5-2.6 4.6-4.8 6l6.2 5.2C40.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-4z"/>
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={20} height={20} viewBox="0 0 814 1000">
      <Path fill="#0A0A0A" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 268.5-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.6-49.1 191.4-49.1z"/>
      <Path fill="#0A0A0A" d="M549.1 38.3c23.6-28.1 40.5-67.5 40.5-106.9 0-5.4-.5-10.8-1.5-15.8-38.4 1.5-84.1 25.3-112.3 57.3-21.8 24.5-42 63.9-42 103.9 0 6 1 12 1.5 14.1 2.5.5 6.5 1 10.5 1 34.5 0 77.3-23.1 103.3-53.6z"/>
    </Svg>
  );
}

export const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  const handleGoogleLogin = () => {};
  const handleAppleLogin = () => {};

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.logoBlock}>
              <Text style={styles.logo}>SCIENCEFIT</Text>
              <Text style={styles.tagline}>Entrena con ciencia</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.formTitle}>Iniciar sesión</Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Correo electrónico</Text>
                <View style={[styles.inputWrap, focusedField === 'email' && styles.inputWrapFocused]}>
                  <Ionicons name="mail-outline" size={18} color={focusedField === 'email' ? COLORS.primary : COLORS.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="tu@email.com"
                    placeholderTextColor={COLORS.textTertiary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Contraseña</Text>
                <View style={[styles.inputWrap, focusedField === 'password' && styles.inputWrapFocused]}>
                  <Ionicons name="lock-closed-outline" size={18} color={focusedField === 'password' ? COLORS.primary : COLORS.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor={COLORS.textTertiary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.textTertiary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
                <TouchableOpacity
                  style={[styles.primaryBtn, (loading || !email || !password) && styles.primaryBtnDisabled]}
                  onPress={handleLogin}
                  onPressIn={pressIn}
                  onPressOut={pressOut}
                  disabled={loading || !email || !password}
                  activeOpacity={1}
                >
                  <Text style={styles.primaryBtnText}>{loading ? 'Ingresando...' : 'Ingresar'}</Text>
                </TouchableOpacity>
              </Animated.View>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>o continuar con</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleLogin} activeOpacity={0.7}>
                  <GoogleLogo />
                  <Text style={styles.socialBtnText}>Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn} onPress={handleAppleLogin} activeOpacity={0.7}>
                  <AppleLogo />
                  <Text style={styles.socialBtnText}>Apple</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLinkText}>
                  ¿No tienes cuenta? <Text style={styles.registerLinkAccent}>Registrarse</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoBlock: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 6,
    letterSpacing: 0.2,
  },
  form: {
    flex: 1,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 28,
    letterSpacing: -0.3,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  inputWrapFocused: {
    borderColor: COLORS.borderFocus,
    backgroundColor: COLORS.background,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.5,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  registerLink: {
    alignItems: 'center',
    marginTop: 28,
  },
  registerLinkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLinkAccent: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
