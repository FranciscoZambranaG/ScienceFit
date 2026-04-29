import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../../firebase.config';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { AuthContext } from '../../context/AuthContext';

export const PhysicalDataScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('principiante');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!weight || !height) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 300) {
      Alert.alert('Error', 'Por favor ingresa un peso válido (1-300 kg)');
      return;
    }

    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 250) {
      Alert.alert('Error', 'Por favor ingresa una altura válida (1-250 cm)');
      return;
    }

    setLoading(true);

    try {
      console.log('Guardando datos físicos en Firebase...');
      console.log('UID del usuario:', user.uid);

      await db.collection('users').doc(user.uid).set({
        weight: weightNum,
        height: heightNum,
        level: selectedLevel,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log('Datos guardados exitosamente');
      console.log('Nivel seleccionado:', selectedLevel);

      navigation.navigate('Biomechanics', {
        userLevel: selectedLevel,
        weight: weightNum,
        height: heightNum
      });
    } catch (error) {
      console.error('Error guardando datos físicos:', error);
      Alert.alert('Error', 'No se pudieron guardar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>
        <Text style={styles.progressText}>Paso 1 de 3</Text>
      </View>

      <Text style={styles.logo}>SCIENCEFIT</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Ionicons name="bar-chart-outline" size={22} color="#000" style={{ marginRight: 8 }} />
        <Text style={[styles.title, { marginBottom: 0 }]}>Datos Físicos</Text>
      </View>

      <Text style={styles.description}>
        Necesitamos algunos datos para personalizar tu experiencia
      </Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Peso (kg)</Text>
        <CustomInput
          placeholder="Ej: 70"
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

        <Text style={styles.label}>Nivel de experiencia:</Text>
        <View style={styles.levelContainer}>
          <TouchableOpacity
            style={[
              styles.levelButton,
              selectedLevel === 'principiante' && styles.levelButtonSelected
            ]}
            onPress={() => setSelectedLevel('principiante')}
          >
            <MaterialCommunityIcons
              name="sprout-outline"
              size={32}
              color={selectedLevel === 'principiante' ? '#D32F2F' : '#555'}
              style={{ marginBottom: 8 }}
            />
            <Text style={[
              styles.levelButtonText,
              selectedLevel === 'principiante' && styles.levelButtonTextSelected
            ]}>
              Principiante
            </Text>
            <Text style={styles.levelDescription}>0-1 año</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.levelButton,
              selectedLevel === 'avanzado' && styles.levelButtonSelected
            ]}
            onPress={() => setSelectedLevel('avanzado')}
          >
            <MaterialCommunityIcons
              name="fire"
              size={32}
              color={selectedLevel === 'avanzado' ? '#D32F2F' : '#555'}
              style={{ marginBottom: 8 }}
            />
            <Text style={[
              styles.levelButtonText,
              selectedLevel === 'avanzado' && styles.levelButtonTextSelected
            ]}>
              Avanzado
            </Text>
            <Text style={styles.levelDescription}>+1 año</Text>
          </TouchableOpacity>
        </View>

        <CustomButton
          title={loading ? "Guardando..." : "Continuar →"}
          onPress={handleContinue}
          disabled={loading}
        />
      </View>
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
    backgroundColor: '#D32F2F',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
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
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  levelButton: {
    flex: 1,
    paddingVertical: 20,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelButtonSelected: {
    backgroundColor: '#FFF0F0',
    borderColor: '#D32F2F',
  },
  levelEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  levelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  levelButtonTextSelected: {
    color: '#D32F2F',
  },
  levelDescription: {
    fontSize: 12,
    color: '#666',
  },
});
