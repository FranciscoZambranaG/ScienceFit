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

export const CoachHomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [clients, setClients] = useState([]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadUserData();
    loadClients();
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

  const loadClients = async () => {
    try {
      setClients([
        { id: '1', name: 'Juan Pérez', workouts: 12, lastWorkout: '2025-01-15' },
        { id: '2', name: 'María García', workouts: 8, lastWorkout: '2025-01-14' },
        { id: '3', name: 'Carlos López', workouts: 15, lastWorkout: '2025-01-16' },
      ]);
    } catch (error) {
      console.error('Error loading clients:', error);
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

  const initials = userData?.name ? userData.name.charAt(0).toUpperCase() : 'C';

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <View>
              <View style={styles.headerTitleRow}>
                <Text style={styles.greeting}>Panel Coach</Text>
                <MaterialCommunityIcons name="dumbbell" size={18} color={COLORS.primary} style={{ marginLeft: 6 }} />
              </View>
              <Text style={styles.subGreeting}>{userData?.name || 'Entrenador'}</Text>
            </View>
            <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.avatarText}>{initials}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            {[
              { value: clients.length, label: 'Clientes' },
              { value: 35, label: 'Entrenamientos' },
              { value: 12, label: 'Esta semana' },
            ].map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mis Clientes</Text>
            <View style={styles.clientList}>
              {clients.map((client) => (
                <TouchableOpacity key={client.id} style={styles.clientCard} activeOpacity={0.7}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>{client.name.charAt(0)}</Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.clientStats}>
                      {client.workouts} entrenamientos · Último: {new Date(client.lastWorkout).toLocaleDateString('es-ES')}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => Alert.alert('Info', 'Próximamente')}
                onPressIn={pressIn}
                onPressOut={pressOut}
                activeOpacity={1}
              >
                <Ionicons name="add-circle-outline" size={20} color="#fff" />
                <Text style={styles.addBtnText}>Agregar Nuevo Cliente</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
              <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
            </TouchableOpacity>
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -1,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textTertiary,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 14,
  },
  clientList: {
    gap: 10,
  },
  clientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 12,
  },
  clientAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clientAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    letterSpacing: -0.1,
    marginBottom: 3,
  },
  clientStats: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
  addBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
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
