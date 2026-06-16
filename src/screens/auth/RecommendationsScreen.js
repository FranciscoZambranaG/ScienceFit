import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
import { AuthContext } from '../../context/AuthContext';
import { SPLITS_DATA } from '../../utils/splitsData';

const COLORS = {
  primary: '#C62828',
  primaryLight: '#FFEBEE',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  textPrimary: '#0A0A0A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0F0F0',
  success: '#10B981',
  successLight: '#ECFDF5',
};

export const RecommendationsScreen = ({ navigation, route }) => {
  const { completeOnboarding } = useContext(AuthContext);
  const { biomechanicsType, userLevel } = route.params;
  const [recommendedSplits, setRecommendedSplits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    generateRecommendations();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const generateRecommendations = () => {
    let recommendations = [];
    switch (biomechanicsType) {
      case 'type_fullbody':
        recommendations = ['fullbody', 'upper-lower'];
        break;
      case 'type_upper_lower':
        recommendations = ['upper-lower', 'fullbody'];
        break;
      case 'type_ppl':
        recommendations = ['ppl', 'arnold-split'];
        break;
      case 'type_arnold':
        recommendations = ['arnold-split', 'ppl'];
        break;
      default:
        if (userLevel === 'principiante') {
          recommendations = ['fullbody', 'upper-lower'];
        } else {
          recommendations = ['ppl', 'arnold-split'];
        }
    }
    setRecommendedSplits(recommendations);
  };

  const handleCompleteOnboarding = async () => {
    setLoading(true);
    try {
      console.log('Completando onboarding desde RecommendationsScreen...');
      const result = await completeOnboarding();
      if (result.success) {
        console.log('Onboarding completado exitosamente');
        Alert.alert(
          '¡Bienvenido a SCIENCEFIT!',
          'Tu perfil ha sido configurado correctamente',
          [
            {
              text: 'Comenzar',
              onPress: () => {
                console.log('Usuario presionó Comenzar, esperando navegación automática...');
              }
            }
          ]
        );
      } else {
        console.error('Error al completar onboarding:', result.error);
        Alert.alert('Error', 'No se pudo completar el proceso. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error inesperado completando onboarding:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Intenta nuevamente.');
    }
    setLoading(false);
  };

  const getSplitData = (splitKey) => SPLITS_DATA[splitKey];

  const getBiomechanicsMessage = () => {
    switch (biomechanicsType) {
      case 'type_fullbody':
        return 'Tu biomecánica se adapta mejor a entrenamientos de cuerpo completo';
      case 'type_upper_lower':
        return 'Tu estructura corporal es ideal para división tren superior/inferior';
      case 'type_ppl':
        return 'Tu biomecánica es perfecta para alta frecuencia de entrenamiento';
      case 'type_arnold':
        return 'Tu desarrollo muscular se beneficia de mayor volumen por grupo';
      default:
        return 'Análisis completado exitosamente';
    }
  };

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.logo}>SCIENCEFIT</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <View style={styles.progressRow}>
              <Text style={styles.progressLabel}>Paso 3 de 3 — Completado</Text>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
            </View>
          </View>

          <Text style={styles.title}>Tus recomendaciones</Text>
          <Text style={styles.subtitle}>Basadas en tu análisis biomecánico personalizado</Text>

          <View style={styles.resultCard}>
            <View style={styles.resultCardHeader}>
              <Ionicons name="bar-chart-outline" size={16} color={COLORS.success} />
              <Text style={styles.resultCardLabel}>Resultado del análisis</Text>
            </View>
            <Text style={styles.resultCardText}>{getBiomechanicsMessage()}</Text>
          </View>

          <Text style={styles.sectionTitle}>Rutinas recomendadas</Text>

          {recommendedSplits.map((splitKey, index) => {
            const split = getSplitData(splitKey);
            if (!split) return null;
            return (
              <View key={splitKey} style={[styles.splitCard, index === 0 && styles.splitCardPrimary]}>
                <View style={styles.splitCardTop}>
                  <View style={[styles.rankBadge, index === 0 ? styles.rankBadgePrimary : styles.rankBadgeSecondary]}>
                    <Text style={[styles.rankBadgeText, index === 0 ? styles.rankBadgeTextPrimary : styles.rankBadgeTextSecondary]}>
                      {index === 0 ? 'Mejor opción' : 'Alternativa'}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name={split.icon}
                    size={28}
                    color={index === 0 ? COLORS.primary : COLORS.textTertiary}
                  />
                </View>
                <Text style={[styles.splitName, index === 0 && styles.splitNamePrimary]}>{split.name}</Text>
                <Text style={styles.splitDescription}>{split.description}</Text>
                <View style={styles.splitMeta}>
                  <View style={styles.splitMetaItem}>
                    <Text style={styles.splitMetaValue}>{Object.keys(split.days).length}</Text>
                    <Text style={styles.splitMetaLabel}>días/semana</Text>
                  </View>
                  <View style={styles.splitMetaDivider} />
                  <View style={styles.splitMetaItem}>
                    <Text style={styles.splitMetaValue}>
                      {splitKey === 'fullbody' || splitKey === 'upper-lower' ? 'Princ.' : 'Avanzado'}
                    </Text>
                    <Text style={styles.splitMetaLabel}>nivel</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={styles.noteCard}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.textTertiary} />
            <Text style={styles.noteText}>
              Estas son recomendaciones basadas en tu análisis. Podrás elegir cualquier rutina desde la app.
            </Text>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
            <TouchableOpacity
              style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
              onPress={handleCompleteOnboarding}
              onPressIn={pressIn}
              onPressOut={pressOut}
              disabled={loading}
              activeOpacity={1}
            >
              <Text style={styles.primaryBtnText}>
                {loading ? 'Finalizando...' : 'Ir a la página principal'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>
          </Animated.View>
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
    backgroundColor: COLORS.success,
    borderRadius: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.success,
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
    marginBottom: 24,
  },
  resultCard: {
    backgroundColor: COLORS.successLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  resultCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resultCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.success,
  },
  resultCardText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  splitCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  splitCardPrimary: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFCFC',
  },
  splitCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rankBadgePrimary: {
    backgroundColor: COLORS.primaryLight,
  },
  rankBadgeSecondary: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  rankBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  rankBadgeTextPrimary: {
    color: COLORS.primary,
  },
  rankBadgeTextSecondary: {
    color: COLORS.textTertiary,
  },
  splitName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  splitNamePrimary: {
    color: COLORS.primary,
  },
  splitDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  splitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  splitMetaItem: {
    flex: 1,
    alignItems: 'center',
  },
  splitMetaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  splitMetaLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  splitMetaDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textTertiary,
    lineHeight: 18,
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
