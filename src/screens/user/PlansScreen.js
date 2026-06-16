import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
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
};

const PLANS = [
  {
    id: 'free',
    name: 'Plan FREE',
    price: '$0',
    period: '/mes',
    accent: COLORS.textSecondary,
    features: [
      'Registro de entrenamientos',
      'Ver entrenamientos',
      'Ver rutinas semanales',
      '3 usos del análisis biomecánico',
      '1 prueba gratuita por día de ScienceIA',
      'Visualización de estudios científicos',
    ],
  },
  {
    id: 'max',
    name: 'Plan MAX',
    price: '$20',
    period: '/mes',
    accent: COLORS.primary,
    badge: 'MÁS POPULAR',
    features: [
      'Todo lo del FREE',
      'ScienceIA ilimitado para análisis de videos',
      'Análisis biomecánico ilimitado',
      'IA analiza cada entrenamiento que agregas',
      'Explicación en lenguaje simple por IA',
    ],
  },
  {
    id: 'max_plicometro',
    name: 'MAX + Plicómetro',
    price: '$40',
    period: '/mes',
    accent: '#0A0A0A',
    badge: 'COMPLETO',
    features: [
      'Todo lo del MAX',
      'Plicómetro físico incluido',
      'Medición de IMC con conexión Bluetooth',
    ],
  },
];

export const PlansScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const animations = useRef(PLANS.map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(PLANS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    loadCurrentPlan();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
    Animated.stagger(
      80,
      animations.map(anim =>
        Animated.spring(anim, { toValue: 1, useNativeDriver: true, tension: 50, friction: 8 })
      )
    ).start();
  }, []);

  const loadCurrentPlan = async () => {
    try {
      const doc = await db.collection('users').doc(user.uid).get();
      if (doc.exists) {
        setCurrentPlan(doc.data().plan || 'free');
      }
    } catch (e) {
      console.error('Error loading plan:', e);
    }
  };

  const handleSelectPlan = async (plan) => {
    if (plan.id === currentPlan) return;
    if (plan.id === 'free') {
      setLoading(true);
      try {
        await db.collection('users').doc(user.uid).update({
          plan: 'free', planStatus: 'active', planExpiry: null,
        });
        setCurrentPlan('free');
        Alert.alert('Plan actualizado', 'Ahora tienes el Plan FREE activo.');
      } catch (e) {
        Alert.alert('Error', 'No se pudo actualizar el plan.');
      }
      setLoading(false);
    } else {
      navigation.navigate('Payment', { plan });
    }
  };

  const handlePressIn = (i) => {
    Animated.spring(scaleAnims[i], { toValue: 1.02, useNativeDriver: true, tension: 300, friction: 10 }).start();
    setSelectedId(PLANS[i].id);
  };

  const handlePressOut = (i) => {
    Animated.spring(scaleAnims[i], { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Planes</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.introBanner}>
            <Text style={styles.introTitle}>Elige tu plan</Text>
            <Text style={styles.introSubtitle}>
              Accede a herramientas científicas de entrenamiento según tu nivel de compromiso
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            {PLANS.map((plan, i) => {
              const translateY = animations[i].interpolate({ inputRange: [0, 1], outputRange: [40, 0] });
              const opacity = animations[i].interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
              const isSelected = selectedId === plan.id;
              const isCurrent = currentPlan === plan.id;

              return (
                <Animated.View
                  key={plan.id}
                  style={[
                    styles.card,
                    {
                      transform: [{ translateY }, { scale: scaleAnims[i] }],
                      opacity,
                      borderColor: isSelected ? plan.accent : COLORS.border,
                      shadowColor: plan.accent,
                      shadowOpacity: isSelected ? 0.12 : 0.04,
                    },
                  ]}
                >
                  {plan.badge && (
                    <View style={[styles.badge, { backgroundColor: plan.accent }]}>
                      <Text style={styles.badgeText}>{plan.badge}</Text>
                    </View>
                  )}

                  <Text style={[styles.planName, { color: plan.accent }]}>{plan.name}</Text>

                  <View style={styles.priceRow}>
                    <Text style={[styles.price, { color: plan.accent }]}>{plan.price}</Text>
                    <Text style={styles.period}>{plan.period}</Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.featuresList}>
                    {plan.features.map((f, fi) => (
                      <View key={fi} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={16} color={plan.accent === COLORS.textSecondary ? COLORS.textTertiary : plan.accent} />
                        <Text style={styles.featureText}>{f}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.selectBtn,
                      { backgroundColor: isCurrent ? COLORS.surface : plan.accent },
                      isCurrent && { borderWidth: 1.5, borderColor: COLORS.border },
                    ]}
                    onPress={() => handleSelectPlan(plan)}
                    onPressIn={() => handlePressIn(i)}
                    onPressOut={() => handlePressOut(i)}
                    disabled={isCurrent || loading}
                    activeOpacity={0.85}
                  >
                    <Text style={[styles.selectBtnText, isCurrent && { color: COLORS.textTertiary }]}>
                      {isCurrent ? 'Plan actual' : 'Elegir plan'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  introBanner: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  introSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 14,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  planName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 18,
  },
  price: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  period: {
    fontSize: 15,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 18,
  },
  featuresList: {
    gap: 10,
    marginBottom: 22,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  selectBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
