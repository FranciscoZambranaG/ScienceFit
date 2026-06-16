import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
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
  success: '#10B981',
  successLight: '#ECFDF5',
};

export const IMCScreen = ({ navigation }) => {
  const [connected, setConnected] = useState(false);
  const [measurements, setMeasurements] = useState({
    chest: '', abdominal: '', thigh: '', triceps: '',
    subscapular: '', suprailiac: '', midaxillary: '',
  });
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [records, setRecords] = useState([]);
  const [showInstructions, setShowInstructions] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    loadRecords();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const loadRecords = async () => {
    try {
      const snapshot = await db.collection('imcRecords')
        .where('userId', '==', auth.currentUser.uid)
        .orderBy('date', 'asc')
        .get();
      const recordsData = [];
      snapshot.forEach((doc) => {
        recordsData.push({ id: doc.id, ...doc.data() });
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
        weight: weightNum, height: heightNum, age: ageNum, gender,
        measurements: measurementsNum,
        bodyFatPercentage: parseFloat(composition.bodyFatPercentage),
        fatMass: parseFloat(composition.fatMass),
        leanMass: parseFloat(composition.leanMass),
        imc: imc.toFixed(2),
      });
      Alert.alert(
        'Resultado',
        `IMC: ${imc.toFixed(2)}\n% Grasa: ${composition.bodyFatPercentage}%\nMasa grasa: ${composition.fatMass}kg\nMasa magra: ${composition.leanMass}kg`,
        [{ text: 'OK', onPress: () => loadRecords() }]
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
    datasets: [{
      data: records.slice(-6).map(r => r.bodyFatPercentage || 0),
      color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
      strokeWidth: 2
    }]
  } : null;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Medición IMC</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.section}>
            {!connected ? (
              <View style={styles.disconnectedCard}>
                <View style={styles.disconnectedIcon}>
                  <MaterialCommunityIcons name="bluetooth-off" size={32} color={COLORS.textTertiary} />
                </View>
                <Text style={styles.disconnectedTitle}>Plicómetro no conectado</Text>
                <Text style={styles.disconnectedSubtitle}>
                  Conecta el plicómetro vía Bluetooth para realizar mediciones precisas
                </Text>
                <TouchableOpacity style={styles.connectBtn} onPress={handleConnectPloicometer} activeOpacity={0.7}>
                  <MaterialCommunityIcons name="bluetooth" size={16} color="#fff" />
                  <Text style={styles.connectBtnText}>Conectar plicómetro</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.connectedCard}>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                <Text style={styles.connectedText}>Plicómetro conectado</Text>
              </View>
            )}
          </View>

          {connected && records.length > 0 && chartData && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>% Grasa corporal</Text>
              <View style={styles.chartCard}>
                <LineChart
                  data={chartData}
                  width={screenWidth - 80}
                  height={180}
                  chartConfig={{
                    backgroundColor: COLORS.background,
                    backgroundGradientFrom: COLORS.background,
                    backgroundGradientTo: COLORS.background,
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(198, 40, 40, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    propsForDots: { r: '5', strokeWidth: '2', stroke: COLORS.primary }
                  }}
                  bezier
                  style={{ borderRadius: 12 }}
                />
              </View>
            </View>
          )}

          {connected && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Datos personales</Text>

                <Text style={styles.label}>Sexo</Text>
                <View style={styles.genderRow}>
                  {[{ id: 'male', label: 'Masculino', icon: 'gender-male' }, { id: 'female', label: 'Femenino', icon: 'gender-female' }].map(g => (
                    <TouchableOpacity
                      key={g.id}
                      style={[styles.genderBtn, gender === g.id && styles.genderBtnSelected]}
                      onPress={() => setGender(g.id)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name={g.icon} size={18} color={gender === g.id ? COLORS.primary : COLORS.textTertiary} />
                      <Text style={[styles.genderBtnText, gender === g.id && styles.genderBtnTextSelected]}>
                        {g.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Peso (kg)</Text>
                <CustomInput placeholder="Ej: 75" value={weight} onChangeText={setWeight} keyboardType="numeric" />

                <Text style={styles.label}>Altura (cm)</Text>
                <CustomInput placeholder="Ej: 175" value={height} onChangeText={setHeight} keyboardType="numeric" />

                <Text style={styles.label}>Edad (años)</Text>
                <CustomInput placeholder="Ej: 25" value={age} onChangeText={setAge} keyboardType="numeric" />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mediciones con plicómetro (mm)</Text>
                <Text style={styles.sectionSubtitle}>Toca el ícono de información para ver instrucciones</Text>

                {PLICOMETER_POINTS[gender].map((point) => (
                  <View key={point.id} style={styles.measurementRow}>
                    <TouchableOpacity
                      style={styles.infoBtn}
                      onPress={() => showMeasurementInstructions(point.id)}
                    >
                      <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.measurementLabel}>{point.name}</Text>
                      <CustomInput
                        placeholder="mm"
                        value={measurements[point.id]}
                        onChangeText={(text) => setMeasurements({ ...measurements, [point.id]: text })}
                        keyboardType="numeric"
                        style={{ marginVertical: 0 }}
                      />
                    </View>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <TouchableOpacity style={styles.calculateBtn} onPress={handleCalculate} activeOpacity={0.8}>
                  <Ionicons name="calculator-outline" size={18} color="#fff" />
                  <Text style={styles.calculateBtnText}>Calcular y guardar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          <View style={{ height: 40 }} />
        </Animated.View>

        {showInstructions && selectedPoint && (
          <View style={styles.instructionsOverlay}>
            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>{selectedPoint.name}</Text>
              <Text style={styles.instructionsDescription}>{selectedPoint.description}</Text>
              <View style={styles.instructionsList}>
                {selectedPoint.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.instructionDot} />
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.instructionsCloseBtn} onPress={() => setShowInstructions(false)}>
                <Text style={styles.instructionsCloseBtnText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 16,
    marginTop: -8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginTop: 12,
    letterSpacing: 0.1,
  },
  disconnectedCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  disconnectedIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  disconnectedTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  disconnectedSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  connectBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  connectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.successLight,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  connectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  chartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  genderBtn: {
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
  genderBtnSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  genderBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  genderBtnTextSelected: {
    color: COLORS.primary,
  },
  measurementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  infoBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  measurementLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  calculateBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  calculateBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  instructionsOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  instructionsCard: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxHeight: '75%',
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  instructionsDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  instructionsList: {
    marginBottom: 20,
    gap: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  instructionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginTop: 6,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  instructionsCloseBtn: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsCloseBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
