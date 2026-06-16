import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../../firebase.config';
import { AuthContext } from '../../context/AuthContext';

const COLORS = {
  primary: '#C62828',
  primaryLight: '#FFEBEE',
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#0A0A0A',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  border: '#F0F0F0',
};

const SPLIT_INFO = {
  'upper-lower': {
    name: 'Up/LW',
    fullName: 'Upper/Lower',
    fullNameSpanish: 'Tren Superior / Tren Inferior',
    icon: 'dumbbell',
    daysPerWeek: 4,
    description: 'División entre tren superior e inferior, ideal para frecuencia 4x semana. Permite entrenar cada grupo muscular 2 veces por semana con buen volumen y recuperación óptima.'
  },
  'arnold-split': {
    name: 'Arnold\nSplit',
    fullName: 'Arnold Split',
    fullNameSpanish: 'Arnold Split',
    icon: 'weight-lifter',
    daysPerWeek: 6,
    description: 'Rutina popularizada por Arnold Schwarzenegger. Divide el cuerpo en Pecho/Espalda, Hombros/Brazos, y Piernas. Perfecta para volumen alto y enfoque en desarrollo muscular completo.'
  },
  'fullbody': {
    name: 'FB',
    fullName: 'Full Body',
    fullNameSpanish: 'Cuerpo Completo',
    icon: 'check-decagram',
    daysPerWeek: 3,
    description: 'Entrena todos los grupos musculares en cada sesión. Ideal para principiantes o frecuencia 3x semana. Maximiza la frecuencia de entrenamiento y es muy eficiente en tiempo.'
  },
  'ppl': {
    name: 'PPL',
    fullName: 'Push/Pull/Legs',
    fullNameSpanish: 'Empuje/Jalón/Piernas',
    icon: 'fire',
    daysPerWeek: 6,
    description: 'Divide entrenamientos en empuje (pecho, hombros, tríceps), jalón (espalda, bíceps) y piernas. Excelente para entrenar 6 días a la semana con alta frecuencia y volumen.'
  }
};

const STUDIES = [
  { author: 'Jeff Nippard', date: 'Hoy', title: 'El mejor split para hipertrofia' },
  { author: 'Ramon Dino', date: 'Ayer', title: 'Eficiencia del RIR' },
  { author: 'Mike Israetel', date: '2d', title: 'Volumen óptimo' },
];

export const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    loadUserData();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const loadUserData = async () => {
    try {
      if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUserData({
        name: user?.email?.split('@')[0] || 'Usuario',
        email: user?.email
      });
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas salir?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Salir', onPress: async () => { await logout(); } },
      ]
    );
  };

  const showSplitInfo = (splitType) => {
    setSelectedSplit(SPLIT_INFO[splitType]);
    setModalVisible(true);
  };

  const navigateToSplit = (splitType) => {
    navigation.navigate('SplitDetail', { splitType });
  };

  const QuickAction = ({ icon, label, onPress, isIonicon = true }) => {
    const scale = useRef(new Animated.Value(1)).current;
    return (
      <TouchableOpacity
        style={styles.quickAction}
        onPress={onPress}
        onPressIn={() => Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }).start()}
        onPressOut={() => Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }).start()}
        activeOpacity={1}
      >
        <Animated.View style={[styles.quickActionInner, { transform: [{ scale }] }]}>
          <View style={styles.quickActionIcon}>
            {isIonicon
              ? <Ionicons name={icon} size={22} color={COLORS.primary} />
              : <MaterialCommunityIcons name={icon} size={22} color={COLORS.primary} />
            }
          </View>
          <Text style={styles.quickActionLabel}>{label}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hola, {userData?.name?.split(' ')[0] || 'Usuario'}</Text>
              <Text style={styles.subGreeting}>Es hora de entrenar</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entrenar</Text>
            <View style={styles.quickActions}>
              <QuickAction icon="add-circle-outline" label={`Agregar\nentrenamiento`} onPress={() => navigation.navigate('AddWorkout')} />
              <QuickAction icon="bar-chart-outline" label={`Ver\nentrenamientos`} onPress={() => navigation.navigate('ViewWorkouts')} />
              <QuickAction icon="body-outline" label={`Medición\nIMC`} onPress={() => navigation.navigate('IMC')} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.scienceIACard}
            onPress={() => navigation.navigate('ScienceIA')}
            activeOpacity={0.85}
          >
            <View style={styles.scienceIALeft}>
              <MaterialCommunityIcons name="robot-outline" size={32} color={COLORS.primary} />
              <View style={{ marginLeft: 14 }}>
                <Text style={styles.scienceIATitle}>ScienceIA</Text>
                <Text style={styles.scienceIASubtitle}>Análisis de técnica con IA</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rutinas semanales</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.splitsScroll}>
              {Object.keys(SPLIT_INFO).map((splitType) => {
                const split = SPLIT_INFO[splitType];
                return (
                  <View key={splitType} style={styles.splitCardWrapper}>
                    <TouchableOpacity
                      style={styles.splitCard}
                      onPress={() => navigateToSplit(splitType)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name={split.icon} size={32} color={COLORS.textSecondary} style={{ marginBottom: 10 }} />
                      <Text style={styles.splitName}>{split.name}</Text>
                      <Text style={styles.splitDays}>{split.daysPerWeek}d/sem</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.splitInfoBtn}
                      onPress={() => showSplitInfo(splitType)}
                    >
                      <Ionicons name="information-circle-outline" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estudios científicos</Text>
            <View style={styles.studiesRow}>
              {STUDIES.map((study, i) => (
                <TouchableOpacity key={i} style={styles.studyCard} activeOpacity={0.7}>
                  <View style={styles.studyMeta}>
                    <Text style={styles.studyAuthor}>{study.author}</Text>
                    <Text style={styles.studyDate}>{study.date}</Text>
                  </View>
                  <Text style={styles.studyTitle}>{study.title}</Text>
                  <View style={styles.studyPlaceholder}>
                    <Ionicons name="document-text-outline" size={22} color={COLORS.textTertiary} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
              <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 32 }} />
        </Animated.View>

        <Modal
          animationType="fade"
          transparent
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                {selectedSplit && (
                  <MaterialCommunityIcons name={selectedSplit.icon} size={40} color={COLORS.primary} style={{ marginBottom: 12 }} />
                )}
                <Text style={styles.modalTitle}>{selectedSplit?.fullNameSpanish}</Text>
                <Text style={styles.modalSubtitle}>{selectedSplit?.fullName}</Text>
              </View>
              <View style={styles.modalFreq}>
                <Text style={styles.modalFreqLabel}>Frecuencia semanal</Text>
                <Text style={styles.modalFreqValue}>{selectedSplit?.daysPerWeek} días</Text>
              </View>
              <Text style={styles.modalDesc}>{selectedSplit?.description}</Text>
              <TouchableOpacity style={styles.modalBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalBtnText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
    letterSpacing: -0.2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    flex: 1,
  },
  quickActionInner: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 10,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  scienceIACard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 28,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  scienceIALeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scienceIATitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  scienceIASubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  splitsScroll: {
    paddingRight: 8,
    gap: 12,
  },
  splitCardWrapper: {
    position: 'relative',
  },
  splitCard: {
    width: 96,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  splitName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  splitDays: {
    fontSize: 11,
    color: COLORS.textTertiary,
    marginTop: 4,
    fontWeight: '500',
  },
  splitInfoBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  studiesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  studyCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  studyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  studyAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  studyDate: {
    fontSize: 10,
    color: COLORS.textTertiary,
  },
  studyTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textPrimary,
    lineHeight: 15,
    marginBottom: 10,
  },
  studyPlaceholder: {
    height: 60,
    backgroundColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  modalFreq: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  modalFreqLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginBottom: 4,
    fontWeight: '500',
  },
  modalFreqValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtn: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
