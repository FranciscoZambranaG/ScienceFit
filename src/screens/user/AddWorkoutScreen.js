import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../../firebase.config';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { SPLITS_DATA } from '../../utils/splitsData';

export const AddWorkoutScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    weight: '',
    reps: '',
    rir: '',
    videoUrl: null,
  });
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [showRepsPicker, setShowRepsPicker] = useState(false);
  const [showRIRPicker, setShowRIRPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const weights = Array.from({ length: 200 }, (_, i) => (i + 1));
  const reps = Array.from({ length: 50 }, (_, i) => (i + 1));
  const rirOptions = Array.from({ length: 11 }, (_, i) => i);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleLoadSplit = (splitType, dayName) => {
    const split = SPLITS_DATA[splitType];
    if (split && split.days[dayName]) {
      const loadedExercises = split.days[dayName].map(ex => ({
        name: ex.name,
        weight: '',
        reps: '',
        rir: '',
        videoUrl: null,
      }));
      setExercises(loadedExercises);
      setShowSplitModal(false);
      Alert.alert('Éxito', `Split "${dayName}" cargado. Completa los datos de cada ejercicio.`);
    }
  };

  const handleAddExercise = () => {
    if (!currentExercise.name) {
      Alert.alert('Error', 'Ingresa el nombre del ejercicio');
      return;
    }
    if (!currentExercise.weight || !currentExercise.reps || currentExercise.rir === '') {
      Alert.alert('Error', 'Completa todos los campos del ejercicio');
      return;
    }

    setExercises([...exercises, currentExercise]);
    setCurrentExercise({
      name: '',
      weight: '',
      reps: '',
      rir: '',
      videoUrl: null,
    });
    Alert.alert('Éxito', 'Ejercicio agregado');
  };

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleSaveWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'Agrega al menos un ejercicio');
      return;
    }

    setLoading(true);
    try {
      await db.collection('workouts').add({
        userId: auth.currentUser.uid,
        date: date.toISOString(),
        exercises: exercises,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Éxito', 'Entrenamiento guardado correctamente', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el entrenamiento');
      console.error(error);
    }
    setLoading(false);
  };

  const handlePickVideo = () => {
    Alert.alert('Info', 'Funcionalidad de video en desarrollo');
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
        <Text style={styles.headerTitle}>Agregar Entrenamiento</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Fecha */}
      <View style={styles.section}>
        <Text style={styles.label}>Fecha</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={16} color="#333" style={{ marginRight: 8 }} />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {/* Cargar Split */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.loadSplitButton}
          onPress={() => setShowSplitModal(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="clipboard-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.loadSplitButtonText}>Cargar Split Predefinido</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Formulario de ejercicio */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nuevo Ejercicio</Text>

        <Text style={styles.label}>Nombre del Ejercicio</Text>
        <CustomInput
          placeholder="Ej: Press Banca"
          value={currentExercise.name}
          onChangeText={(text) => setCurrentExercise({...currentExercise, name: text})}
        />

        <Text style={styles.label}>Peso (kg)</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowWeightPicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {currentExercise.weight ? `${currentExercise.weight} kg` : 'Seleccionar peso'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Repeticiones</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowRepsPicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {currentExercise.reps ? `${currentExercise.reps} reps` : 'Seleccionar repeticiones'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>RIR (Reps in Reserve)</Text>
        <TouchableOpacity
          style={styles.pickerButton}
          onPress={() => setShowRIRPicker(true)}
        >
          <Text style={styles.pickerButtonText}>
            {currentExercise.rir !== '' ? `RIR ${currentExercise.rir}` : 'Seleccionar RIR'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.videoButton}
          onPress={handlePickVideo}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="videocam-outline" size={18} color="#D32F2F" style={{ marginRight: 8 }} />
            <Text style={styles.videoButtonText}>Agregar Video (Opcional)</Text>
          </View>
        </TouchableOpacity>

        <CustomButton
          title="Agregar Ejercicio"
          onPress={handleAddExercise}
          style={{ marginTop: 15 }}
        />
      </View>

      {/* Lista de ejercicios agregados */}
      {exercises.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ejercicios Agregados ({exercises.length})</Text>
          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDetails}>
                  {exercise.weight}kg × {exercise.reps} reps | RIR {exercise.rir}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveExercise(index)}
              >
                <Text style={styles.removeButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Botón guardar */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: exercises.length > 0 && !loading ? '#4CAF50' : '#ccc' }]}
          onPress={handleSaveWorkout}
          disabled={loading || exercises.length === 0}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="save-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.saveButtonText}>{loading ? 'Guardando...' : 'Guardar Entrenamiento'}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Modal para cargar split */}
      <Modal
        visible={showSplitModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Split</Text>
            <ScrollView>
              {Object.entries(SPLITS_DATA).map(([key, split]) => (
                <View key={key}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name={split.icon} size={20} color="#000" style={{ marginRight: 6 }} />
                    <Text style={styles.splitTitle}>{split.name}</Text>
                  </View>
                  {Object.keys(split.days).map((dayName) => (
                    <TouchableOpacity
                      key={dayName}
                      style={styles.splitDayButton}
                      onPress={() => handleLoadSplit(key, dayName)}
                    >
                      <Text style={styles.splitDayText}>{dayName}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
            <CustomButton
              title="Cancelar"
              onPress={() => setShowSplitModal(false)}
              style={{ backgroundColor: '#999', marginTop: 15 }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para peso */}
      <Modal
        visible={showWeightPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Peso</Text>
            <CustomInput
              placeholder="Peso personalizado (ej: 52.5)"
              keyboardType="numeric"
              onChangeText={(text) => {
                setCurrentExercise({...currentExercise, weight: text});
              }}
            />
            <FlatList
              data={weights}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setCurrentExercise({...currentExercise, weight: item.toString()});
                    setShowWeightPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{item} kg</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
            <CustomButton
              title="Cerrar"
              onPress={() => setShowWeightPicker(false)}
              style={{ backgroundColor: '#999', marginTop: 15 }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para repeticiones */}
      <Modal
        visible={showRepsPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar Repeticiones</Text>
            <FlatList
              data={reps}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setCurrentExercise({...currentExercise, reps: item.toString()});
                    setShowRepsPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>{item} repeticiones</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
            <CustomButton
              title="Cerrar"
              onPress={() => setShowRepsPicker(false)}
              style={{ backgroundColor: '#999', marginTop: 15 }}
            />
          </View>
        </View>
      </Modal>

      {/* Modal para RIR */}
      <Modal
        visible={showRIRPicker}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccionar RIR</Text>
            <Text style={styles.modalSubtitle}>
              RIR = Repeticiones en Reserva{'\n'}
              0 = Fallo muscular{'\n'}
              1-2 = Cerca del fallo{'\n'}
              3+ = Lejos del fallo
            </Text>
            <FlatList
              data={rirOptions}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.pickerItem}
                  onPress={() => {
                    setCurrentExercise({...currentExercise, rir: item.toString()});
                    setShowRIRPicker(false);
                  }}
                >
                  <Text style={styles.pickerItemText}>RIR {item}</Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 300 }}
            />
            <CustomButton
              title="Cerrar"
              onPress={() => setShowRIRPicker(false)}
              style={{ backgroundColor: '#999', marginTop: 15 }}
            />
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#333',
  },
  dateButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#333',
  },
  loadSplitButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadSplitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  pickerButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  videoButton: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  videoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    lineHeight: 18,
  },
  splitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#000',
  },
  splitDayButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  splitDayText: {
    fontSize: 14,
    color: '#333',
  },
  pickerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
