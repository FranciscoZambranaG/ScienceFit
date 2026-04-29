import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';
import { SPLITS_DATA } from '../../utils/splitsData';

export const RecommendationsScreen = ({ navigation, route }) => {
  const { completeOnboarding } = useContext(AuthContext);
  const { biomechanicsType, userLevel } = route.params;
  const [recommendedSplits, setRecommendedSplits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateRecommendations();
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

  const getSplitData = (splitKey) => {
    return SPLITS_DATA[splitKey];
  };

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <Text style={[styles.progressText, { marginTop: 0 }]}>Paso 3 de 3 - ¡Completado! </Text>
          <Ionicons name="checkmark-circle-outline" size={12} color="#4CAF50" />
        </View>
      </View>

      <Text style={styles.logo}>SCIENCEFIT</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5 }}>
        <MaterialCommunityIcons name="target" size={22} color="#000" style={{ marginRight: 8 }} />
        <Text style={[styles.title, { marginBottom: 0 }]}>Recomendaciones</Text>
      </View>

      <Text style={styles.subtitle}>Basadas en tu análisis biomecánico</Text>

      <View style={styles.analysisResultContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="bar-chart-outline" size={16} color="#2E7D32" style={{ marginRight: 6 }} />
          <Text style={[styles.analysisResultTitle, { marginBottom: 0 }]}>Resultado del Análisis</Text>
        </View>
        <Text style={styles.analysisResultText}>{getBiomechanicsMessage()}</Text>
      </View>

      <Text style={styles.sectionTitle}>Rutinas Recomendadas para ti:</Text>

      {recommendedSplits.map((splitKey, index) => {
        const split = getSplitData(splitKey);
        if (!split) return null;

        return (
          <View key={splitKey} style={styles.splitCard}>
            <View style={styles.splitHeader}>
              <View style={styles.splitBadge}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {index === 0 ? (
                    <Ionicons name="star-outline" size={12} color="#F57C00" style={{ marginRight: 4 }} />
                  ) : (
                    <MaterialCommunityIcons name="fire" size={12} color="#F57C00" style={{ marginRight: 4 }} />
                  )}
                  <Text style={styles.splitBadgeText}>
                    {index === 0 ? 'Mejor Opción' : 'Alternativa'}
                  </Text>
                </View>
              </View>
            </View>

            <MaterialCommunityIcons
              name={split.icon}
              size={40}
              color="#555"
              style={{ alignSelf: 'center', marginBottom: 10 }}
            />
            <Text style={styles.splitName}>{split.name}</Text>
            <Text style={styles.splitDescription}>{split.description}</Text>

            <View style={styles.splitInfo}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Días por semana:</Text>
                <Text style={styles.infoValue}>
                  {Object.keys(split.days).length}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nivel:</Text>
                <Text style={styles.infoValue}>
                  {splitKey === 'fullbody' || splitKey === 'upper-lower'
                    ? 'Principiante-Intermedio'
                    : 'Intermedio-Avanzado'}
                </Text>
              </View>
            </View>
          </View>
        );
      })}

      <View style={styles.noteContainer}>
        <Ionicons name="bulb-outline" size={24} color="#666" style={{ marginRight: 10 }} />
        <Text style={styles.noteText}>
          Estas son solo recomendaciones. Podrás elegir cualquier rutina desde la app.
        </Text>
      </View>

      <CustomButton
        title={loading ? "Finalizando..." : "Ir a la Página Principal"}
        onPress={handleCompleteOnboarding}
        disabled={loading}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '600',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  analysisResultContainer: {
    backgroundColor: '#E8F5E9',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  analysisResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  analysisResultText: {
    fontSize: 14,
    color: '#1B5E20',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  splitCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  splitHeader: {
    marginBottom: 10,
  },
  splitBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  splitBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
  },
  splitIcon: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 10,
  },
  splitName: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  splitDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  splitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
});
