import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SPLITS_DATA } from '../../utils/splitsData';

export const SplitDetailScreen = ({ navigation, route }) => {
  const { splitType } = route.params;
  const split = SPLITS_DATA[splitType];

  if (!split) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Split no encontrado</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="close-circle-outline" size={80} color="#D32F2F" style={{ marginBottom: 20 }} />
          <Text style={styles.errorText}>No se encontró información del split</Text>
          <TouchableOpacity
            style={styles.backHomeButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backHomeButtonText}>← Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialCommunityIcons name={split.icon} size={20} color="#000" style={{ marginRight: 6 }} />
          <Text style={styles.headerTitle}>{split.name}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.description}>{split.description}</Text>
      </View>

      {Object.entries(split.days).map(([dayName, exercises]) => (
        <View key={dayName} style={styles.daySection}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{dayName}</Text>
            <Text style={styles.daySubtitle}>{exercises.length} ejercicios</Text>
          </View>

          {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseCard}>
              <View style={styles.exerciseNumber}>
                <Text style={styles.exerciseNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseDetails}>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>
                      {exercise.sets} series
                    </Text>
                  </View>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>
                      {exercise.repsRange} reps
                    </Text>
                  </View>
                  <View style={[styles.detailBadge, styles.muscleGroupBadge]}>
                    <Text style={[styles.detailBadgeText, styles.muscleGroupText]}>
                      {exercise.muscleGroup}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}

      <View style={styles.notesSection}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <Ionicons name="clipboard-outline" size={18} color="#000" style={{ marginRight: 8 }} />
          <Text style={[styles.notesTitle, { marginBottom: 0 }]}>Notas del Split</Text>
        </View>
        <View style={styles.noteCard}>
          <Ionicons name="bulb-outline" size={24} color="#333" style={{ marginRight: 15 }} />
          <Text style={styles.noteText}>
            Este split está basado en principios científicos de hipertrofia y frecuencia óptima de entrenamiento.
          </Text>
        </View>
        <View style={styles.noteCard}>
          <Ionicons name="timer-outline" size={24} color="#333" style={{ marginRight: 15 }} />
          <Text style={styles.noteText}>
            Descansa 2-3 minutos entre series de ejercicios compuestos y 1-2 minutos en ejercicios de aislamiento.
          </Text>
        </View>
        <View style={styles.noteCard}>
          <Ionicons name="trending-up-outline" size={24} color="#333" style={{ marginRight: 15 }} />
          <Text style={styles.noteText}>
            Progresa incrementando peso cuando puedas completar todas las series en el rango superior de repeticiones.
          </Text>
        </View>
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
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
  },
  daySection: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  dayHeader: {
    marginBottom: 15,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  daySubtitle: {
    fontSize: 12,
    color: '#999',
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  exerciseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D32F2F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exerciseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  detailBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  muscleGroupBadge: {
    backgroundColor: '#E3F2FD',
  },
  muscleGroupText: {
    color: '#1976D2',
  },
  notesSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#f8f8f8',
    marginTop: 30,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  noteIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  backHomeButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backHomeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
