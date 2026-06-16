import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../../firebase.config';

const COLORS = {
  primary: '#C62828',
  primaryLight: '#FFEBEE',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  textPrimary: '#0A0A0A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0F0F0',
};

export const ViewWorkoutsScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    loadWorkouts();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const loadWorkouts = async () => {
    try {
      const snapshot = await db.collection('workouts')
        .where('userId', '==', auth.currentUser.uid)
        .orderBy('date', 'desc')
        .get();

      const workoutsData = [];
      snapshot.forEach((doc) => {
        workoutsData.push({ id: doc.id, ...doc.data() });
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
        year: 'numeric', month: 'long', day: 'numeric'
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(workout);
    });
    return grouped;
  };

  const groupedWorkouts = groupWorkoutsByDate();

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Cargando entrenamientos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <View style={styles.container}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mis entrenamientos</Text>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddWorkout')}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scroll}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            {workouts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconWrap}>
                  <MaterialCommunityIcons name="dumbbell" size={36} color={COLORS.textTertiary} />
                </View>
                <Text style={styles.emptyTitle}>Sin entrenamientos</Text>
                <Text style={styles.emptySubtitle}>Comienza registrando tu primera sesión</Text>
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => navigation.navigate('AddWorkout')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="add" size={18} color="#fff" />
                  <Text style={styles.emptyBtnText}>Agregar entrenamiento</Text>
                </TouchableOpacity>
              </View>
            ) : (
              Object.entries(groupedWorkouts).map(([date, dayWorkouts]) => (
                <View key={date} style={styles.dateGroup}>
                  <View style={styles.dateLabelRow}>
                    <Ionicons name="calendar-outline" size={14} color={COLORS.textTertiary} />
                    <Text style={styles.dateLabel}>{date}</Text>
                  </View>
                  {dayWorkouts.map((workout) => (
                    <View key={workout.id} style={styles.workoutCard}>
                      <View style={styles.workoutCardHeader}>
                        <View>
                          <Text style={styles.workoutCardTitle}>
                            {workout.exercises.length} ejercicio{workout.exercises.length !== 1 ? 's' : ''}
                          </Text>
                          <Text style={styles.workoutCardTime}>
                            {new Date(workout.date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </View>
                        <View style={styles.workoutBadge}>
                          <Text style={styles.workoutBadgeText}>{workout.exercises.length}</Text>
                        </View>
                      </View>

                      <View style={styles.exercisesList}>
                        {workout.exercises.map((exercise, index) => (
                          <View key={index} style={styles.exerciseRow}>
                            <View style={styles.exerciseDot} />
                            <View style={styles.exerciseRowInfo}>
                              <Text style={styles.exerciseRowName}>{exercise.name}</Text>
                              <Text style={styles.exerciseRowStats}>
                                {exercise.weight}kg · {exercise.reps} reps · RIR {exercise.rir}
                              </Text>
                            </View>
                            {exercise.videoUrl && (
                              <Ionicons name="videocam-outline" size={14} color={COLORS.textTertiary} />
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              ))
            )}
            <View style={{ height: 40 }} />
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  scroll: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  emptyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  dateGroup: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  workoutCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  workoutCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  workoutCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 3,
    letterSpacing: -0.1,
  },
  workoutCardTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  workoutBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  exercisesList: {
    gap: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  exerciseRowInfo: {
    flex: 1,
  },
  exerciseRowName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  exerciseRowStats: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
});
