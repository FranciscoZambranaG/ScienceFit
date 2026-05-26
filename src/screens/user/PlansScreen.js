import { Ionicons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../../firebase.config';
import { AuthContext } from '../../context/AuthContext';

const PLANS = [
  {
    id: 'free',
    name: 'Plan FREE',
    price: '$0',
    period: '/mes',
    accent: '#666',
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
    accent: '#C62828',
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
    name: 'Plan MAX + Plicómetro',
    price: '$40',
    period: '/mes',
    accent: '#1a1a2e',
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

  const animations = useRef(PLANS.map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(PLANS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    loadCurrentPlan();
    Animated.stagger(
      100,
      animations.map(anim =>
        Animated.spring(anim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        })
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
          plan: 'free',
          planStatus: 'active',
          planExpiry: null,
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
    Animated.spring(scaleAnims[i], {
      toValue: 1.02,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
    setSelectedId(PLANS[i].id);
  };

  const handlePressOut = (i) => {
    Animated.spring(scaleAnims[i], {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Planes ScienceFit</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.subtitle}>
        Elige el plan que mejor se adapte a tus objetivos
      </Text>

      <View style={styles.cardsContainer}>
        {PLANS.map((plan, i) => {
          const translateY = animations[i].interpolate({
            inputRange: [0, 1],
            outputRange: [60, 0],
          });
          const opacity = animations[i].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          });
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
                  borderColor: isSelected ? plan.accent : '#e0e0e0',
                  shadowColor: plan.accent,
                  shadowOpacity: isSelected ? 0.25 : 0.06,
                  elevation: isSelected ? 8 : 3,
                },
              ]}
            >
              {plan.badge && (
                <View style={[styles.badge, { backgroundColor: plan.accent }]}>
                  <Text style={styles.badgeText}>{plan.badge}</Text>
                </View>
              )}

              <Text style={[styles.planName, { color: plan.accent }]}>
                {plan.name}
              </Text>

              <View style={styles.priceRow}>
                <Text style={[styles.price, { color: plan.accent }]}>
                  {plan.price}
                </Text>
                <Text style={styles.period}>{plan.period}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.featuresList}>
                {plan.features.map((f, fi) => (
                  <View key={fi} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={18} color="#2E7D32" />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  { backgroundColor: isCurrent ? '#e8e8e8' : plan.accent },
                ]}
                onPress={() => handleSelectPlan(plan)}
                onPressIn={() => handlePressIn(i)}
                onPressOut={() => handlePressOut(i)}
                disabled={isCurrent || loading}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.selectButtonText,
                    { color: isCurrent ? '#999' : '#fff' },
                  ]}
                >
                  {isCurrent ? 'Plan Actual' : 'Elegir Plan'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C62828',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    paddingHorizontal: 30,
    marginBottom: 24,
    lineHeight: 22,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  planName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
  },
  period: {
    fontSize: 15,
    color: '#999',
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  featuresList: {
    gap: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#444',
    flex: 1,
    lineHeight: 20,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
