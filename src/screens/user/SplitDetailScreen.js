import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
};

export const SplitDetailScreen = ({ navigation, route }) => {
  const { splitType } = route.params;
  const split = SPLITS_DATA[splitType];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  if (!split) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Split no encontrado</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="close-circle-outline" size={56} color={COLORS.primary} style={{ marginBottom: 16 }} />
          <Text style={styles.errorTitle}>No se encontró información del split</Text>
          <TouchableOpacity style={styles.errorBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.errorBtnText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const NOTES = [
    { icon: 'bulb-outline', text: 'Este split está basado en principios científicos de hipertrofia y frecuencia óptima de entrenamiento.' },
    { icon: 'timer-outline', text: 'Descansa 2-3 minutos entre series de ejercicios compuestos y 1-2 minutos en aislamiento.' },
    { icon: 'trending-up-outline', text: 'Progresa incrementando peso cuando puedas completar todas las series en el rango superior de repeticiones.' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <MaterialCommunityIcons name={split.icon} size={18} color={COLORS.primary} />
              <Text style={styles.headerTitle}>{split.name}</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.descCard}>
            <Text style={styles.descText}>{split.description}</Text>
          </View>

          {Object.entries(split.days).map(([dayName, exercises]) => (
            <View key={dayName} style={styles.daySection}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayTitle}>{dayName}</Text>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>{exercises.length} ejercicios</Text>
                </View>
              </View>

              {exercises.map((exercise, index) => (
                <View key={index} style={styles.exerciseCard}>
                  <View style={styles.exerciseNum}>
                    <Text style={styles.exerciseNumText}>{index + 1}</Text>
                  </View>
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <View style={styles.badgeRow}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{exercise.sets} series</Text>
                      </View>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{exercise.repsRange} reps</Text>
                      </View>
                      <View style={[styles.badge, styles.badgeMuscle]}>
                        <Text style={[styles.badgeText, styles.badgeMuscleText]}>{exercise.muscleGroup}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}

          <View style={styles.notesSection}>
            <Text style={styles.notesSectionTitle}>Notas del split</Text>
            {NOTES.map((note, i) => (
              <View key={i} style={styles.noteCard}>
                <View style={styles.noteIconWrap}>
                  <Ionicons name={note.icon} size={18} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  descCard: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  descText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  daySection: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  dayBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dayBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textTertiary,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    marginTop: 1,
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
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  badgeMuscle: {
    backgroundColor: COLORS.primaryLight,
    borderColor: '#FFCDD2',
  },
  badgeMuscleText: {
    color: COLORS.primary,
  },
  notesSection: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: COLORS.surface,
    marginTop: 28,
  },
  notesSectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.2,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.2,
  },
  errorBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  errorBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
