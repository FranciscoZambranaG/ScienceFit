import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
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

const ROLES = [
  { id: 'usuario', label: 'Usuario', icon: 'person-outline', description: 'Quiero entrenar' },
  { id: 'coach', label: 'Coach', icon: 'dumbbell', description: 'Soy entrenador', isMC: true },
];

const Field = ({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, fieldKey, showToggle, onToggle, shown, focusedField, setFocusedField }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrap, focusedField === fieldKey && styles.inputWrapFocused]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textTertiary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
        autoCorrect={false}
        onFocus={() => setFocusedField(fieldKey)}
        onBlur={() => setFocusedField(null)}
      />
      {showToggle && (
        <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
          <Ionicons name={shown ? 'eye-outline' : 'eye-off-outline'} size={18} color={COLORS.textTertiary} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export const RegisterScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('usuario');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    await register(email, password, name, selectedRole);
    setLoading(false);
  };

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.logo}>SCIENCEFIT</Text>
              <View style={{ width: 40 }} />
            </View>

            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Únete y empieza a entrenar con ciencia</Text>

            <Field
              label="Nombre completo"
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              fieldKey="name"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
            />
            <Field
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              fieldKey="email"
              focusedField={focusedField}
              setFocusedField={setFocusedField}
            />
            <Field
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry={!showPassword}
              fieldKey="password"
              showToggle
              onToggle={() => setShowPassword(!showPassword)}
              shown={showPassword}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
            />
            <Field
              label="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Repite tu contraseña"
              secureTextEntry={!showConfirm}
              fieldKey="confirm"
              showToggle
              onToggle={() => setShowConfirm(!showConfirm)}
              shown={showConfirm}
              focusedField={focusedField}
              setFocusedField={setFocusedField}
            />

            <View style={styles.roleSection}>
              <Text style={styles.label}>Tipo de cuenta</Text>
              <View style={styles.roleRow}>
                {ROLES.map(role => (
                  <TouchableOpacity
                    key={role.id}
                    style={[styles.roleCard, selectedRole === role.id && styles.roleCardSelected]}
                    onPress={() => setSelectedRole(role.id)}
                    activeOpacity={0.7}
                  >
                    {role.isMC
                      ? <MaterialCommunityIcons name={role.icon} size={22} color={selectedRole === role.id ? COLORS.primary : COLORS.textTertiary} />
                      : <Ionicons name={role.icon} size={22} color={selectedRole === role.id ? COLORS.primary : COLORS.textTertiary} />
                    }
                    <Text style={[styles.roleLabel, selectedRole === role.id && styles.roleLabelSelected]}>{role.label}</Text>
                    <Text style={styles.roleDesc}>{role.description}</Text>
                    {selectedRole === role.id && (
                      <View style={styles.roleCheck}>
                        <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleRegister}
                onPressIn={pressIn}
                onPressOut={pressOut}
                disabled={loading}
                activeOpacity={1}
              >
                <Text style={styles.primaryBtnText}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>
                ¿Ya tienes cuenta? <Text style={styles.loginLinkAccent}>Ingresar</Text>
              </Text>
            </TouchableOpacity>
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
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginBottom: 28,
    lineHeight: 22,
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
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    height: '100%',
  },
  eyeBtn: {
    padding: 4,
  },
  roleSection: {
    marginBottom: 24,
  },
  roleRow: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    gap: 6,
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  roleLabelSelected: {
    color: COLORS.primary,
  },
  roleDesc: {
    fontSize: 12,
    color: COLORS.textTertiary,
    textAlign: 'center',
  },
  roleCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginLinkAccent: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
