import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
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
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  info: '#3B82F6',
  infoLight: '#EFF6FF',
};

const FEATURES = [
  { icon: 'body-outline', title: 'Biomecánica', desc: 'Análisis de ángulos articulares y alineación' },
  { icon: 'expand-outline', title: 'Rango de movimiento', desc: 'Verifica ROM completo y efectivo' },
  { icon: 'time-outline', title: 'Tempo de ejecución', desc: 'Mide velocidad excéntrica y concéntrica' },
  { icon: 'navigate-outline', title: 'Estabilidad', desc: 'Detecta compensaciones y desbalances' },
];

const TIPS = [
  { icon: 'navigate-outline', text: 'Graba desde un ángulo lateral para mejor análisis' },
  { icon: 'sunny-outline', text: 'Asegura buena iluminación' },
  { icon: 'phone-portrait-outline', text: 'Mantén la cámara estable' },
  { icon: 'repeat-outline', text: 'Graba al menos 3 repeticiones completas' },
];

export const ScienceIAScreen = ({ navigation }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [videoSelected, setVideoSelected] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (analyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.05, duration: 700, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [analyzing]);

  const handleSelectVideo = () => {
    Alert.alert(
      'Seleccionar Video',
      'Elige una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Grabar nuevo', onPress: () => { setVideoSelected(true); Alert.alert('Info', 'En producción se abriría la cámara'); } },
        { text: 'Galería', onPress: () => { setVideoSelected(true); Alert.alert('Info', 'En producción se abriría la galería'); } }
      ]
    );
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult({
        exercise: 'Press Banca',
        score: 8.5,
        feedback: [
          { type: 'success', text: 'Buena retracción escapular durante todo el movimiento' },
          { type: 'warning', text: 'Los codos se abren ligeramente más de 45° en la fase excéntrica' },
          { type: 'info', text: 'Velocidad de ejecución: 2-1-2 (óptimo para hipertrofia)' },
          { type: 'success', text: 'ROM completo alcanzado en todas las repeticiones' },
        ],
        recommendations: [
          'Intenta mantener los codos a 45° para reducir estrés en hombros',
          'El arco lumbar es adecuado para levantamiento seguro',
          'Considera aumentar el peso en 2.5kg la próxima sesión',
        ],
      });
      setAnalyzing(false);
    }, 3000);
  };

  const getFeedbackStyle = (type) => {
    switch (type) {
      case 'success': return { bg: COLORS.successLight, border: '#D1FAE5', icon: 'checkmark-circle-outline', color: COLORS.success };
      case 'warning': return { bg: COLORS.warningLight, border: '#FDE68A', icon: 'warning-outline', color: COLORS.warning };
      default: return { bg: COLORS.infoLight, border: '#BFDBFE', icon: 'information-circle-outline', color: COLORS.info };
    }
  };

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>ScienceIA</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconWrap}>
              <MaterialCommunityIcons name="robot-outline" size={32} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.heroTitle}>Análisis de técnica con IA</Text>
              <Text style={styles.heroSubtitle}>Feedback biomecánico instantáneo</Text>
            </View>
          </View>

          {!videoSelected ? (
            <View style={styles.section}>
              <View style={styles.uploadZone}>
                <Ionicons name="videocam-outline" size={36} color={COLORS.textTertiary} style={{ marginBottom: 12 }} />
                <Text style={styles.uploadTitle}>Sube o graba un video</Text>
                <Text style={styles.uploadHint}>Asegúrate de que se vea todo tu cuerpo</Text>
                <TouchableOpacity style={styles.uploadBtn} onPress={handleSelectVideo} activeOpacity={0.7}>
                  <Ionicons name="cloud-upload-outline" size={18} color={COLORS.primary} />
                  <Text style={styles.uploadBtnText}>Seleccionar video</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.tipsTitle}>Para mejores resultados</Text>
              {TIPS.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={styles.tipIconWrap}>
                    <Ionicons name={tip.icon} size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          ) : !analysisResult ? (
            <View style={styles.section}>
              <View style={styles.videoReadyCard}>
                <Ionicons name="videocam" size={28} color={COLORS.success} />
                <Text style={styles.videoReadyText}>Video listo para analizar</Text>
              </View>

              {analyzing ? (
                <Animated.View style={[styles.analyzingCard, { transform: [{ scale: pulseAnim }] }]}>
                  <MaterialCommunityIcons name="brain" size={22} color={COLORS.primary} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.analyzingTitle}>Analizando técnica...</Text>
                    <Text style={styles.analyzingSubtitle}>Evaluando biomecánica, ROM, tempo y ejecución</Text>
                  </View>
                </Animated.View>
              ) : (
                <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
                  <TouchableOpacity
                    style={styles.analyzeBtn}
                    onPress={handleAnalyze}
                    onPressIn={pressIn}
                    onPressOut={pressOut}
                    activeOpacity={1}
                  >
                    <MaterialCommunityIcons name="robot-outline" size={20} color="#fff" />
                    <Text style={styles.analyzeBtnText}>Analizar con IA</Text>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>
          ) : (
            <View style={styles.section}>
              <View style={styles.resultCard}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultExercise}>{analysisResult.exercise}</Text>
                  <View style={styles.scoreWrap}>
                    <Text style={styles.scoreNumber}>{analysisResult.score}</Text>
                    <Text style={styles.scoreDenom}>/10</Text>
                  </View>
                </View>

                <Text style={styles.resultSectionLabel}>Análisis detallado</Text>
                {analysisResult.feedback.map((item, index) => {
                  const fs = getFeedbackStyle(item.type);
                  return (
                    <View key={index} style={[styles.feedbackItem, { backgroundColor: fs.bg, borderColor: fs.border }]}>
                      <Ionicons name={fs.icon} size={16} color={fs.color} style={{ marginRight: 10, marginTop: 2 }} />
                      <Text style={[styles.feedbackText, { color: fs.color }]}>{item.text}</Text>
                    </View>
                  );
                })}

                <Text style={[styles.resultSectionLabel, { marginTop: 16 }]}>Recomendaciones</Text>
                {analysisResult.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recRow}>
                    <View style={styles.recDot} />
                    <Text style={styles.recText}>{rec}</Text>
                  </View>
                ))}

                <View style={styles.resultActions}>
                  <TouchableOpacity
                    style={styles.secondaryBtn}
                    onPress={() => { setVideoSelected(false); setAnalysisResult(null); }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="refresh-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.secondaryBtnText}>Nuevo análisis</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => Alert.alert('Info', 'Análisis guardado')}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="save-outline" size={16} color="#fff" />
                    <Text style={styles.primaryBtnText}>Guardar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          <View style={styles.featuresSection}>
            <Text style={styles.featuresTitle}>Qué analiza ScienceIA</Text>
            {FEATURES.map((feature, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIconWrap}>
                  <Ionicons name={feature.icon} size={20} color={COLORS.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDesc}>{feature.desc}</Text>
                </View>
              </View>
            ))}
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
    paddingBottom: 12,
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
  heroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  heroIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  uploadZone: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    padding: 36,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  uploadHint: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  videoReadyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.successLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  videoReadyText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.success,
  },
  analyzingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  analyzingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 3,
  },
  analyzingSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.7,
  },
  analyzeBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  analyzeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  resultCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultExercise: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  scoreWrap: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: -1,
  },
  scoreDenom: {
    fontSize: 16,
    color: COLORS.textTertiary,
    marginLeft: 2,
  },
  resultSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  recRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 10,
  },
  recDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  recText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  featuresSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: COLORS.surface,
    marginHorizontal: 0,
  },
  featuresTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    marginBottom: 16,
  },
  featureIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
});
