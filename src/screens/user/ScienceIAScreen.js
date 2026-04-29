import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';

export const ScienceIAScreen = ({ navigation }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [videoSelected, setVideoSelected] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleSelectVideo = () => {
    Alert.alert(
      'Seleccionar Video',
      'Elige una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Grabar Nuevo',
          onPress: () => {
            setVideoSelected(true);
            Alert.alert('Info', 'En producción se abriría la cámara');
          }
        },
        {
          text: 'Galería',
          onPress: () => {
            setVideoSelected(true);
            Alert.alert('Info', 'En producción se abriría la galería');
          }
        }
      ]
    );
  };

  const handleAnalyze = () => {
    setAnalyzing(true);

    // Simulación de análisis con IA
    setTimeout(() => {
      setAnalysisResult({
        exercise: 'Press Banca',
        score: 8.5,
        feedback: [
          {
            type: 'success',
            text: 'Buena retracción escapular durante todo el movimiento'
          },
          {
            type: 'warning',
            text: 'Los codos se abren ligeramente más de 45° en la fase excéntrica'
          },
          {
            type: 'info',
            text: 'Velocidad de ejecución: 2-1-2 (óptimo para hipertrofia)'
          },
          {
            type: 'success',
            text: 'ROM completo alcanzado en todas las repeticiones'
          },
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

  const getColorForType = (type) => {
    switch(type) {
      case 'success': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'error': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getIconForType = (type) => {
    const color = getColorForType(type);
    switch(type) {
      case 'success': return <Ionicons name="checkmark-circle-outline" size={18} color={color} style={{ marginRight: 10 }} />;
      case 'warning': return <Ionicons name="warning-outline" size={18} color={color} style={{ marginRight: 10 }} />;
      case 'error': return <Ionicons name="close-circle-outline" size={18} color={color} style={{ marginRight: 10 }} />;
      default: return <Ionicons name="information-circle-outline" size={18} color={color} style={{ marginRight: 10 }} />;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ScienceIA</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.heroSection}>
        <MaterialCommunityIcons name="robot-outline" size={60} color="#fff" style={{ marginBottom: 15 }} />
        <Text style={styles.heroTitle}>Análisis de Técnica con IA</Text>
        <Text style={styles.heroSubtitle}>
          Graba tu ejecución y recibe feedback biomecánico instantáneo
        </Text>
      </View>

      {!videoSelected ? (
        <View style={styles.section}>
          <View style={styles.uploadContainer}>
            <Ionicons name="videocam-outline" size={60} color="#666" style={{ marginBottom: 15 }} />
            <Text style={styles.uploadText}>Sube o graba un video</Text>
            <Text style={styles.uploadSubtext}>
              Asegúrate de que se vea todo tu cuerpo y el movimiento completo
            </Text>
            <CustomButton
              title="Seleccionar Video"
              onPress={handleSelectVideo}
              style={{ marginTop: 20 }}
            />
          </View>

          <View style={styles.tipsSection}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
              <Ionicons name="bulb-outline" size={18} color="#000" style={{ marginRight: 6 }} />
              <Text style={[styles.tipsTitle, { marginBottom: 0 }]}>Consejos para mejores resultados:</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="navigate-outline" size={20} color="#333" style={{ marginRight: 10 }} />
              <Text style={styles.tipText}>Graba desde un ángulo lateral para mejor análisis</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="bulb-outline" size={20} color="#333" style={{ marginRight: 10 }} />
              <Text style={styles.tipText}>Asegura buena iluminación</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="help-circle-outline" size={20} color="#333" style={{ marginRight: 10 }} />
              <Text style={styles.tipText}>Mantén la cámara estable</Text>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="time-outline" size={20} color="#333" style={{ marginRight: 10 }} />
              <Text style={styles.tipText}>Graba al menos 3 repeticiones completas</Text>
            </View>
          </View>
        </View>
      ) : !analysisResult ? (
        <View style={styles.section}>
          <View style={styles.videoPreview}>
            <Ionicons name="videocam-outline" size={60} color="#2E7D32" style={{ marginBottom: 15 }} />
            <Text style={styles.videoPreviewText}>Video listo para analizar</Text>
          </View>

          <CustomButton
            title={analyzing ? "Analizando..." : "Analizar con IA"}
            onPress={handleAnalyze}
            disabled={analyzing}
            style={{ backgroundColor: analyzing ? '#999' : '#4A90E2' }}
          />

          {analyzing && (
            <View style={styles.analyzingContainer}>
              <Text style={styles.analyzingText}>Analizando tu técnica...</Text>
              <Text style={styles.analyzingSubtext}>
                Evaluando biomecánica, ROM, tempo y ejecución
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultExercise}>{analysisResult.exercise}</Text>
              <View style={styles.scoreContainer}>
                <Text style={styles.scoreNumber}>{analysisResult.score}</Text>
                <Text style={styles.scoreLabel}>/10</Text>
              </View>
            </View>

            <View style={styles.feedbackSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Ionicons name="bar-chart-outline" size={18} color="#000" style={{ marginRight: 6 }} />
                <Text style={[styles.feedbackTitle, { marginBottom: 0 }]}>Análisis Detallado:</Text>
              </View>
              {analysisResult.feedback.map((item, index) => (
                <View key={index} style={styles.feedbackItem}>
                  {getIconForType(item.type)}
                  <Text style={[styles.feedbackText, { color: getColorForType(item.type) }]}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.recommendationsSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <MaterialCommunityIcons name="dumbbell" size={18} color="#2E7D32" style={{ marginRight: 6 }} />
                <Text style={[styles.recommendationsTitle, { marginBottom: 0 }]}>Recomendaciones:</Text>
              </View>
              {analysisResult.recommendations.map((rec, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <Text style={styles.recommendationBullet}>•</Text>
                  <Text style={styles.recommendationText}>{rec}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => {
                  setVideoSelected(false);
                  setAnalysisResult(null);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="refresh-outline" size={16} color="#333" style={{ marginRight: 6 }} />
                  <Text style={styles.secondaryButtonText}>Nuevo Análisis</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => Alert.alert('Info', 'Análisis guardado')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryButtonText}>Guardar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.featuresSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Ionicons name="analytics-outline" size={20} color="#000" style={{ marginRight: 6 }} />
          <Text style={[styles.featuresTitle, { marginBottom: 0 }]}>Qué analiza ScienceIA:</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="body-outline" size={30} color="#666" style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Biomecánica</Text>
            <Text style={styles.featureText}>Análisis de ángulos articulares y alineación</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="expand-outline" size={30} color="#666" style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Rango de Movimiento</Text>
            <Text style={styles.featureText}>Verifica ROM completo y efectivo</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="time-outline" size={30} color="#666" style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Tempo de Ejecución</Text>
            <Text style={styles.featureText}>Mide velocidad excéntrica y concéntrica</Text>
          </View>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="navigate-outline" size={30} color="#666" style={{ marginRight: 15 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>Estabilidad</Text>
            <Text style={styles.featureText}>Detecta compensaciones y desbalances</Text>
          </View>
        </View>
      </View>
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
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 40,
    backgroundColor: '#4A90E2',
  },
  heroIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  uploadContainer: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#e0e0e0',
  },
  uploadIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  uploadSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tipsSection: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#FFF9E6',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFE57F',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  videoPreview: {
    alignItems: 'center',
    paddingVertical: 50,
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  videoPreviewIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  videoPreviewText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  analyzingContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 15,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 5,
  },
  analyzingSubtext: {
    fontSize: 12,
    color: '#1976D2',
    textAlign: 'center',
  },
  resultCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  resultExercise: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginLeft: 2,
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  feedbackItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 10,
  },
  feedbackIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  feedbackText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  recommendationsSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2E7D32',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  recommendationBullet: {
    fontSize: 18,
    marginRight: 10,
    color: '#4CAF50',
  },
  recommendationText: {
    fontSize: 14,
    flex: 1,
    color: '#1B5E20',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginRight: 10,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f8f8',
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
