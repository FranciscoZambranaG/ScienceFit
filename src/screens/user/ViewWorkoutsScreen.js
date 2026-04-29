import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../../firebase.config';

export const ViewWorkoutsScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    try {
      const snapshot = await db.collection('workouts')
        .where('userId', '==', auth.currentUser.uid)
        .orderBy('date', 'desc')
        .get();

      const workoutsData = [];
      snapshot.forEach((doc) => {
        workoutsData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setWorkouts(workoutsData);
    } catch (error) {
      console.error('Error loading workouts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadWorkouts();
  };

  const groupWorkoutsByDate = () => {
    const grouped = {};

    workouts.forEach(workout => {
      const date = new Date(workout.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(workout);
    });

    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByDate();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
        <Text style={styles.loadingText}>Cargando entrenamientos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Entrenamientos</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workouts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="dumbbell" size={80} color="#ccc" style={{ marginBottom: 20 }} />
            <Text style={styles.emptyText}>No hay entrenamientos aún</Text>
            <Text style={styles.emptySubtext}>
              Comienza agregando tu primer entrenamiento
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate('AddWorkout')}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.addButtonText}>Agregar Entrenamiento</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          Object.entries(groupedWorkouts).map(([date, dayWorkouts]) => (
            <View key={date} style={styles.dateSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Ionicons name="calendar-outline" size={16} color="#000" style={{ marginRight: 6 }} />
                <Text style={[styles.dateTitle, { marginBottom: 0 }]}>{date}</Text>
              </View>
              {dayWorkouts.map((workout) => (
                <View key={workout.id} style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutTitle}>
                      Entrenamiento - {workout.exercises.length} ejercicios
                    </Text>
                    <Text style={styles.workoutTime}>
                      {new Date(workout.date).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>

                  {workout.exercises.map((exercise, index) => (
                    <View key={index} style={styles.exerciseItem}>
                      <View style={styles.exerciseDot} />
                      <View style={styles.exerciseDetails}>
                        <Text style={styles.exerciseName}>{exercise.name}</Text>
                        <Text style={styles.exerciseStats}>
                          {exercise.weight}kg × {exercise.reps} reps | RIR {exercise.rir}
                        </Text>
                      </View>
                      {exercise.videoUrl && (
                        <Text style={styles.videoIndicator}>🎥</Text>
                      )}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  addButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  workoutCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  workoutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  workoutTime: {
    fontSize: 12,
    color: '#999',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D32F2F',
    marginRight: 10,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 3,
  },
  exerciseStats: {
    fontSize: 12,
    color: '#666',
  },
  videoIndicator: {
    fontSize: 20,
  },
});
