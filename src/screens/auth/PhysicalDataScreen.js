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
import { db } from '../../../firebase.config';
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

const LEVELS = [
  { id: 'principiante', label: 'Principiante', desc: 'Menos de 1 año entrenando', icon: 'body-outline' },
  { id: 'avanzado', label: 'Avanzado', desc: 'Más de 1 año entrenando', icon: 'barbell-outline' },
];

export const PhysicalDataScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('principiante');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = async () => {
    if (!weight || !height) {
      Alert.alert('Error', 'Por favor ingresa tu peso y altura');
      return;
    }
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    if (isNaN(weightNum) || weightNum < 30 || weightNum > 300) {
      Alert.alert('Error', 'Ingresa un peso válido (30-300 kg)');
      return;
    }
    if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) {
      Alert.alert('Error', 'Ingresa una altura válida (100-250 cm)');
      return;
    }
    setLoading(true);
    try {
      await db.collection('users').doc(user.uid).update({
        weight: weightNum,
        height: heightNum,
        userLevel: selectedLevel,
      });
      navigation.navigate('Biomechanics', { userLevel: selectedLevel });
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos');
      console.error(error);
    }
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
            <Text style={styles.logo}>SCIENCEFIT</Text>

            <View style={styles.progressSection}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '33%' }]} />
              </View>
              <Text style={styles.progressLabel}>Paso 1 de 3 — Datos físicos</Text>
            </View>

            <Text style={styles.title}>Tu perfil físico</Text>
            <Text style={styles.subtitle}>Necesitamos estos datos para personalizar tus recomendaciones</Text>

            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { marginRight: 8 }]}>
                <View style={[styles.inputWrap, focusedField === 'weight' && styles.inputWrapFocused]}>
                  <MaterialCommunityIcons name="weight-kilogram" size={18} color={focusedField === 'weight' ? COLORS.primary : COLORS.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="75"
                    placeholderTextColor={COLORS.textTertiary}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('weight')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                <Text style={styles.metricLabel}>Peso (kg)</Text>
              </View>

              <View style={[styles.metricCard, { marginLeft: 8 }]}>
                <View style={[styles.inputWrap, focusedField === 'height' && styles.inputWrapFocused]}>
                  <Ionicons name="resize-outline" size={18} color={focusedField === 'height' ? COLORS.primary : COLORS.textTertiary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="175"
                    placeholderTextColor={COLORS.textTertiary}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                    onFocus={() => setFocusedField('height')}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
                <Text style={styles.metricLabel}>Altura (cm)</Text>
              </View>
            </View>

            <View style={styles.levelSection}>
              <Text style={styles.sectionLabel}>Nivel de experiencia</Text>
              <View style={styles.levelRow}>
                {LEVELS.map(level => (
                  <TouchableOpacity
                    key={level.id}
                    style={[styles.levelCard, selectedLevel === level.id && styles.levelCardSelected]}
                    onPress={() => setSelectedLevel(level.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={level.icon}
                      size={24}
                      color={selectedLevel === level.id ? COLORS.primary : COLORS.textTertiary}
                    />
                    <Text style={[styles.levelLabel, selectedLevel === level.id && styles.levelLabelSelected]}>
                      {level.label}
                    </Text>
                    <Text style={styles.levelDesc}>{level.desc}</Text>
                    {selectedLevel === level.id && (
                      <View style={styles.levelCheck}>
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
                onPress={handleContinue}
                onPressIn={pressIn}
                onPressOut={pressOut}
                disabled={loading}
                activeOpacity={1}
              >
                <Text style={styles.primaryBtnText}>{loading ? 'Guardando...' : 'Continuar'}</Text>
                {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />}
              </TouchableOpacity>
            </Animated.View>
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
    paddingTop: 24,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 28,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 32,
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 28,
  },
  metricCard: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
    marginTop: 8,
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
    paddingHorizontal: 14,
  },
  inputWrapFocused: {
    borderColor: COLORS.borderFocus,
    backgroundColor: COLORS.background,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    height: '100%',
  },
  levelSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.1,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 12,
  },
  levelCard: {
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
  levelCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  levelLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  levelLabelSelected: {
    color: COLORS.primary,
  },
  levelDesc: {
    fontSize: 11,
    color: COLORS.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  levelCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});
