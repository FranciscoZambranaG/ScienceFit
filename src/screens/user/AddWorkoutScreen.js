import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../../firebase.config';
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
  borderFocus: '#C62828',
  success: '#10B981',
  successLight: '#ECFDF5',
};

export const AddWorkoutScreen = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({ name: '', weight: '', reps: '', rir: '', videoUrl: null });
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const [showRepsPicker, setShowRepsPicker] = useState(false);
  const [showRIRPicker, setShowRIRPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const scaleBtn = useRef(new Animated.Value(1)).current;
  const scaleSave = useRef(new Animated.Value(1)).current;

  const weights = Array.from({ length: 200 }, (_, i) => (i + 1));
  const reps = Array.from({ length: 50 }, (_, i) => (i + 1));
  const rirOptions = Array.from({ length: 11 }, (_, i) => i);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const handleLoadSplit = (splitType, dayName) => {
    const split = SPLITS_DATA[splitType];
    if (split && split.days[dayName]) {
      const loadedExercises = split.days[dayName].map(ex => ({
        name: ex.name, weight: '', reps: '', rir: '', videoUrl: null,
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
    setCurrentExercise({ name: '', weight: '', reps: '', rir: '', videoUrl: null });
    Alert.alert('Éxito', 'Ejercicio agregado');
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
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
        exercises,
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

  const PickerModal = ({ visible, title, data, onSelect, onClose, subtitle }) => (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHandleBar} />
          <Text style={styles.modalTitle}>{title}</Text>
          {subtitle && <Text style={styles.modalSubtitle}>{subtitle}</Text>}
          <FlatList
            data={data}
            keyExtractor={(item) => item.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.pickerItem} onPress={() => onSelect(item)}>
                <Text style={styles.pickerItemText}>{data === rirOptions ? `RIR ${item}` : data === reps ? `${item} repeticiones` : `${item} kg`}</Text>
                <Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} />
              </TouchableOpacity>
            )}
            style={{ maxHeight: 280 }}
          />
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseBtnText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar entrenamiento</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Fecha</Text>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.dateBtnText}>
              {date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
          )}
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.loadSplitBtn} onPress={() => setShowSplitModal(true)} activeOpacity={0.7}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={18} color={COLORS.primary} />
            <Text style={styles.loadSplitBtnText}>Cargar split predefinido</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuevo ejercicio</Text>

          <Text style={styles.label}>Nombre del ejercicio</Text>
          <View style={[styles.inputWrap, focusedField === 'exName' && styles.inputWrapFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Press banca"
              placeholderTextColor={COLORS.textTertiary}
              value={currentExercise.name}
              onChangeText={(text) => setCurrentExercise({ ...currentExercise, name: text })}
              onFocus={() => setFocusedField('exName')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.metricsRow}>
            <View style={[styles.metricField, { marginRight: 6 }]}>
              <Text style={styles.label}>Peso</Text>
              <TouchableOpacity style={styles.selectField} onPress={() => setShowWeightPicker(true)}>
                <Text style={[styles.selectFieldText, !currentExercise.weight && styles.selectFieldPlaceholder]}>
                  {currentExercise.weight ? `${currentExercise.weight} kg` : '— kg'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={COLORS.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.metricField, { marginHorizontal: 6 }]}>
              <Text style={styles.label}>Reps</Text>
              <TouchableOpacity style={styles.selectField} onPress={() => setShowRepsPicker(true)}>
                <Text style={[styles.selectFieldText, !currentExercise.reps && styles.selectFieldPlaceholder]}>
                  {currentExercise.reps ? `${currentExercise.reps}` : '—'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={COLORS.textTertiary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.metricField, { marginLeft: 6 }]}>
              <Text style={styles.label}>RIR</Text>
              <TouchableOpacity style={styles.selectField} onPress={() => setShowRIRPicker(true)}>
                <Text style={[styles.selectFieldText, currentExercise.rir === '' && styles.selectFieldPlaceholder]}>
                  {currentExercise.rir !== '' ? `${currentExercise.rir}` : '—'}
                </Text>
                <Ionicons name="chevron-down" size={14} color={COLORS.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.videoBtn} onPress={handlePickVideo} activeOpacity={0.7}>
            <Ionicons name="videocam-outline" size={16} color={COLORS.primary} />
            <Text style={styles.videoBtnText}>Agregar video (opcional)</Text>
          </TouchableOpacity>

          <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
            <TouchableOpacity
              style={styles.addExerciseBtn}
              onPress={handleAddExercise}
              onPressIn={() => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start()}
              onPressOut={() => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start()}
              activeOpacity={1}
            >
              <Ionicons name="add" size={18} color={COLORS.primary} />
              <Text style={styles.addExerciseBtnText}>Agregar ejercicio</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {exercises.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ejercicios ({exercises.length})</Text>
            {exercises.map((exercise, index) => (
              <View key={index} style={styles.exerciseCard}>
                <View style={styles.exerciseNum}>
                  <Text style={styles.exerciseNumText}>{index + 1}</Text>
                </View>
                <View style={styles.exerciseInfo}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <Text style={styles.exerciseStats}>
                    {exercise.weight}kg · {exercise.reps} reps · RIR {exercise.rir}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveExercise(index)}
                >
                  <Ionicons name="trash-outline" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Animated.View style={{ transform: [{ scale: scaleSave }] }}>
            <TouchableOpacity
              style={[styles.saveBtn, (exercises.length === 0 || loading) && styles.saveBtnDisabled]}
              onPress={handleSaveWorkout}
              onPressIn={() => Animated.timing(scaleSave, { toValue: 0.97, duration: 100, useNativeDriver: true }).start()}
              onPressOut={() => Animated.timing(scaleSave, { toValue: 1, duration: 100, useNativeDriver: true }).start()}
              disabled={loading || exercises.length === 0}
              activeOpacity={1}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.saveBtnText}>{loading ? 'Guardando...' : 'Guardar entrenamiento'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={{ height: 32 }} />

        <Modal visible={showSplitModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHandleBar} />
              <Text style={styles.modalTitle}>Seleccionar split</Text>
              <ScrollView style={{ maxHeight: 340 }}>
                {Object.entries(SPLITS_DATA).map(([key, split]) => (
                  <View key={key}>
                    <View style={styles.splitGroupHeader}>
                      <MaterialCommunityIcons name={split.icon} size={16} color={COLORS.textSecondary} />
                      <Text style={styles.splitGroupTitle}>{split.name}</Text>
                    </View>
                    {Object.keys(split.days).map((dayName) => (
                      <TouchableOpacity
                        key={dayName}
                        style={styles.splitDayBtn}
                        onPress={() => handleLoadSplit(key, dayName)}
                      >
                        <Text style={styles.splitDayText}>{dayName}</Text>
                        <Ionicons name="chevron-forward" size={14} color={COLORS.textTertiary} />
                      </TouchableOpacity>
                    ))}
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowSplitModal(false)}>
                <Text style={styles.modalCloseBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <PickerModal
          visible={showWeightPicker}
          title="Seleccionar peso"
          data={weights}
          onSelect={(item) => { setCurrentExercise({ ...currentExercise, weight: item.toString() }); setShowWeightPicker(false); }}
          onClose={() => setShowWeightPicker(false)}
        />
        <PickerModal
          visible={showRepsPicker}
          title="Seleccionar repeticiones"
          data={reps}
          onSelect={(item) => { setCurrentExercise({ ...currentExercise, reps: item.toString() }); setShowRepsPicker(false); }}
          onClose={() => setShowRepsPicker(false)}
        />
        <PickerModal
          visible={showRIRPicker}
          title="Seleccionar RIR"
          data={rirOptions}
          onSelect={(item) => { setCurrentExercise({ ...currentExercise, rir: item.toString() }); setShowRIRPicker(false); }}
          onClose={() => setShowRIRPicker(false)}
          subtitle="0 = fallo muscular · 1-2 = cerca del fallo · 3+ = lejos del fallo"
        />
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
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  dateBtnText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  loadSplitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  loadSplitBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputWrapFocused: {
    borderColor: COLORS.borderFocus,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    height: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metricField: {
    flex: 1,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
  },
  selectFieldText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  selectFieldPlaceholder: {
    color: COLORS.textTertiary,
    fontWeight: '400',
  },
  videoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  videoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  addExerciseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  addExerciseBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  exerciseNum: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exerciseNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  exerciseStats: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  removeBtn: {
    padding: 8,
  },
  saveBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    maxHeight: '75%',
  },
  modalHandleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 16,
    lineHeight: 16,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pickerItemText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  splitGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  splitGroupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  splitDayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  splitDayText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  modalCloseBtn: {
    height: 52,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  modalCloseBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
});
