import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
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
import { db } from '../../../firebase.config';
import { AuthContext } from '../../context/AuthContext';

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

const MENU_ITEMS = [
  { iconType: 'ion', icon: 'people-outline', label: 'Gestionar Usuarios', msg: 'Ver usuarios - Próximamente' },
  { iconType: 'mc', icon: 'dumbbell', label: 'Gestionar Coaches', msg: 'Ver coaches - Próximamente' },
  { iconType: 'ion', icon: 'bar-chart-outline', label: 'Ver Entrenamientos', msg: 'Ver entrenamientos - Próximamente' },
  { iconType: 'ion', icon: 'settings-outline', label: 'Configuración', msg: 'Configuración - Próximamente' },
];

const ACTIVITY = [
  { text: 'Nuevo usuario registrado', time: 'Hace 2 horas' },
  { text: 'Coach agregó nuevo cliente', time: 'Hace 5 horas' },
  { text: '15 entrenamientos completados hoy', time: 'Hace 8 horas' },
];

export const AdminHomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalCoaches: 0, totalWorkouts: 0 });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserData();
    loadStats();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const loadUserData = async () => {
    try {
      if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) setUserData(userDoc.data());
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadStats = async () => {
    try {
      const usersSnapshot = await db.collection('users').where('role', '==', 'usuario').get();
      const coachesSnapshot = await db.collection('users').where('role', '==', 'coach').get();
      const workoutsSnapshot = await db.collection('workouts').get();
      setStats({
        totalUsers: usersSnapshot.size,
        totalCoaches: coachesSnapshot.size,
        totalWorkouts: workoutsSnapshot.size,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  const initials = userData?.name ? userData.name.charAt(0).toUpperCase() : 'A';

  const STAT_ITEMS = [
    { iconType: 'ion', icon: 'people-outline', value: stats.totalUsers, label: 'Usuarios' },
    { iconType: 'mc', icon: 'dumbbell', value: stats.totalCoaches, label: 'Coaches' },
    { iconType: 'ion', icon: 'bar-chart-outline', value: stats.totalWorkouts, label: 'Entrenamientos' },
    { iconType: 'mc', icon: 'fire', value: '98%', label: 'Actividad' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <View>
              <View style={styles.headerTitleRow}>
                <Text style={styles.greeting}>Panel Admin</Text>
                <MaterialCommunityIcons name="crown-outline" size={18} color={COLORS.primary} style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.subGreeting}>{userData?.name || 'Administrador'}</Text>
            </View>
            <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            {STAT_ITEMS.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <View style={styles.statIconWrap}>
                  {stat.iconType === 'mc'
                    ? <MaterialCommunityIcons name={stat.icon} size={20} color={COLORS.primary} />
                    : <Ionicons name={stat.icon} size={20} color={COLORS.primary} />
                  }
                </View>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestión</Text>
            <View style={styles.menuList}>
              {MENU_ITEMS.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.menuItem}
                  onPress={() => Alert.alert('Info', item.msg)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuIconWrap}>
                    {item.iconType === 'mc'
                      ? <MaterialCommunityIcons name={item.icon} size={18} color={COLORS.textSecondary} />
                      : <Ionicons name={item.icon} size={18} color={COLORS.textSecondary} />
                    }
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Actividad Reciente</Text>
            <View style={styles.activityCard}>
              {ACTIVITY.map((item, i) => (
                <View key={i} style={[styles.activityRow, i < ACTIVITY.length - 1 && styles.activityRowBorder]}>
                  <View style={styles.activityIconWrap}>
                    <Ionicons name="time-outline" size={14} color={COLORS.textTertiary} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityText}>{item.text}</Text>
                    <Text style={styles.activityTime}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
              <TouchableOpacity
                style={styles.logoutBtn}
                onPress={handleLogout}
                onPressIn={pressIn}
                onPressOut={pressOut}
                activeOpacity={1}
              >
                <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
                <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </Animated.View>
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 3,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  menuList: {
    gap: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.1,
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  activityRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#FFCDD2',
  },
  logoutBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
