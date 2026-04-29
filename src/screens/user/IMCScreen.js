import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { auth, db } from '../../../firebase.config';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { PLICOMETER_POINTS, calculateBodyComposition, calculateBodyFat } from '../../utils/plicometerData';

const screenWidth = Dimensions.get('window').width;

export const IMCScreen = ({ navigation }) => {
  const [connected, setConnected] = useState(false);
  const [measurements, setMeasurements] = useState({
    chest: '',
    abdominal: '',
    thigh: '',
    triceps: '',
    subscapular: '',
    suprailiac: '',
    midaxillary: '',
  });
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [records, setRecords] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      const snapshot = await db.collection('imcRecords')
        .where('userId', '==', auth.currentUser.uid)
        .orderBy('date', 'asc')
        .get();

      const recordsData = [];
      snapshot.forEach((doc) => {
        recordsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setRecords(recordsData);
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const handleConnectPloicometer = () => {
    Alert.alert(
      'Simulación',
      'En producción, aquí se conectaría el plicómetro vía Bluetooth',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Simular Conexión',
          onPress: () => {
            setConnected(true);
            Alert.alert('Éxito', 'Plicómetro conectado (simulado)');
          }
        }
      ]
    );
  };

  const handleCalculate = async () => {
    if (!weight || !height || !age) {
      Alert.alert('Error', 'Por favor completa peso, altura y edad');
      return;
    }

    const allMeasurements = Object.values(measurements).every(m => m !== '');
    if (!allMeasurements) {
      Alert.alert('Error', 'Por favor completa todas las mediciones de pliegues');
      return;
    }

    const measurementsNum = {};
    Object.keys(measurements).forEach(key => {
      measurementsNum[key] = parseFloat(measurements[key]);
    });

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    const bodyFatPercentage = calculateBodyFat(measurementsNum, ageNum, gender);
    const composition = calculateBodyComposition(weightNum, bodyFatPercentage);

    const heightInMeters = heightNum / 100;
    const imc = weightNum / (heightInMeters * heightInMeters);

    try {
      await db.collection('imcRecords').add({
        userId: auth.currentUser.uid,
        date: new Date().toISOString(),
        weight: weightNum,
        height: heightNum,
        age: ageNum,
        gender: gender,
        measurements: measurementsNum,
        bodyFatPercentage: parseFloat(composition.bodyFatPercentage),
        fatMass: parseFloat(composition.fatMass),
        leanMass: parseFloat(composition.leanMass),
        imc: imc.toFixed(2),
      });

      Alert.alert(
        'Resultado',
        `IMC: ${imc.toFixed(2)}\n` +
        `% Grasa Corporal: ${composition.bodyFatPercentage}%\n` +
        `Masa Grasa: ${composition.fatMass}kg\n` +
        `Masa Magra: ${composition.leanMass}kg`,
        [
          { text: 'OK', onPress: () => loadRecords() }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la medición');
      console.error(error);
    }
  };

  const showMeasurementInstructions = (pointId) => {
    const point = PLICOMETER_POINTS[gender].find(p => p.id === pointId);
    if (point) {
      setSelectedPoint(point);
      setShowInstructions(true);
    }
  };

  const chartData = records.length > 0 ? {
    labels: records.slice(-6).map(r => new Date(r.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })),
    datasets: [
      {
        data: records.slice(-6).map(r => r.bodyFatPercentage || 0),
        color: (opacity = 1) => `rgba(211, 47, 47, ${opacity})`,
        strokeWidth: 2
      }
    ]
  } : null;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medición IMC</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Estado de conexión */}
      <View style={styles.section}>
        {!connected ? (
          <View style={styles.disconnectedContainer}>
            <Text style={styles.disconnectedIcon}>📏</Text>
            <Text style={styles.disconnectedText}>Plicómetro no conectado</Text>
            <Text style={styles.disconnectedSubtext}>
              Conecta el plicómetro vía Bluetooth para realizar mediciones precisas
            </Text>
            <CustomButton
              title="Conectar Plicómetro"
              onPress={handleConnectPloicometer}
            />
          </View>
        ) : (
          <View style={styles.connectedContainer}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#2E7D32" style={{ marginRight: 10 }} />
            <Text style={styles.connectedText}>Plicómetro conectado</Text>
          </View>
        )}
      </View>

      {/* Gráfica de progreso */}
      {connected && records.length > 0 && chartData && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso de % Grasa Corporal</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(211, 47, 47, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#D32F2F'
              }
            }}
            bezier
            style={styles.chart}
          />
        </View>
      )}

      {/* Formulario de medición */}
      {connected && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos Personales</Text>

            <Text style={styles.label}>Sexo</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
                onPress={() => setGender('male')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name="gender-male"
                    size={20}
                    color={gender === 'male' ? '#fff' : '#333'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.genderButtonText, gender === 'male' && styles.genderButtonTextSelected]}>
                    Masculino
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
                onPress={() => setGender('female')}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    name="gender-female"
                    size={20}
                    color={gender === 'female' ? '#fff' : '#333'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.genderButtonText, gender === 'female' && styles.genderButtonTextSelected]}>
                    Femenino
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Peso (kg)</Text>
            <CustomInput
              placeholder="Ej: 75"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Altura (cm)</Text>
            <CustomInput
              placeholder="Ej: 175"
              value={height}
              onChangeText={setHeight}
              keyboardType="numeric"
            />

            <Text style={styles.label}>Edad (años)</Text>
            <CustomInput
              placeholder="Ej: 25"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mediciones con Plicómetro (mm)</Text>
            <Text style={styles.sectionSubtitle}>
              Toca cada punto para ver instrucciones detalladas
            </Text>

            {PLICOMETER_POINTS[gender].map((point) => (
              <View key={point.id} style={styles.measurementRow}>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => showMeasurementInstructions(point.id)}
                >
                  <Ionicons name="information-circle-outline" size={24} color="#4A90E2" />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                  <Text style={styles.measurementLabel}>{point.name}</Text>
                  <CustomInput
                    placeholder="mm"
                    value={measurements[point.id]}
                    onChangeText={(text) => setMeasurements({...measurements, [point.id]: text})}
                    keyboardType="numeric"
                    style={{ marginVertical: 0 }}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <CustomButton
              title="Calcular y Guardar"
              onPress={handleCalculate}
              style={{ backgroundColor: '#4CAF50' }}
            />
          </View>
        </>
      )}

      {/* Modal de instrucciones */}
      {showInstructions && selectedPoint && (
        <View style={styles.instructionsOverlay}>
          <View style={styles.instructionsModal}>
            <Text style={styles.instructionsTitle}>{selectedPoint.name}</Text>
            <Text style={styles.instructionsDescription}>{selectedPoint.description}</Text>

            <View style={styles.instructionsList}>
              {selectedPoint.instructions.map((instruction, index) => (
                <Text key={index} style={styles.instructionItem}>
                  • {instruction}
                </Text>
              ))}
            </View>

            <CustomButton
              title="Entendido"
              onPress={() => setShowInstructions(false)}
            />
          </View>
        </View>
      )}
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  disconnectedContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  disconnectedIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  disconnectedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  disconnectedSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  connectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  connectedIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  connectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  genderButtonSelected: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  genderButtonTextSelected: {
    color: '#fff',
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoButtonText: {
    fontSize: 24,
  },
  measurementLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionsModal: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxHeight: '80%',
  },
  instructionsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center',
  },
  instructionsDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionsList: {
    marginBottom: 20,
  },
  instructionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
});
