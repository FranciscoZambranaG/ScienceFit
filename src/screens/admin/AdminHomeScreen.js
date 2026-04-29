import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../../firebase.config';
import { AuthContext } from '../../context/AuthContext';

export const AdminHomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCoaches: 0,
    totalWorkouts: 0,
  });

  useEffect(() => {
    loadUserData();
    loadStats();
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
    }
  };

  const loadStats = async () => {
    try {
      const usersSnapshot = await db.collection('users')
        .where('role', '==', 'usuario')
        .get();

      const coachesSnapshot = await db.collection('users')
        .where('role', '==', 'coach')
        .get();

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
        {
          text: 'Salir',
          onPress: async () => {
            await logout();
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.greeting}>Admin {userData?.name || 'Usuario'} </Text>
            <MaterialCommunityIcons name="crown-outline" size={24} color="#000" />
          </View>
          <Text style={styles.subGreeting}>Panel de administración</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people-outline" size={36} color="#D32F2F" style={{ marginBottom: 10 }} />
          <Text style={styles.statNumber}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Usuarios</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="dumbbell" size={36} color="#D32F2F" style={{ marginBottom: 10 }} />
          <Text style={styles.statNumber}>{stats.totalCoaches}</Text>
          <Text style={styles.statLabel}>Coaches</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="bar-chart-outline" size={36} color="#D32F2F" style={{ marginBottom: 10 }} />
          <Text style={styles.statNumber}>{stats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Entrenamientos</Text>
        </View>
        <View style={styles.statCard}>
          <MaterialCommunityIcons name="fire" size={36} color="#D32F2F" style={{ marginBottom: 10 }} />
          <Text style={styles.statNumber}>98%</Text>
          <Text style={styles.statLabel}>Actividad</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gestión</Text>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Info', 'Ver usuarios - Próximamente')}
        >
          <Ionicons name="people-outline" size={24} color="#555" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Gestionar Usuarios</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Info', 'Ver coaches - Próximamente')}
        >
          <MaterialCommunityIcons name="dumbbell" size={24} color="#555" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Gestionar Coaches</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Info', 'Ver entrenamientos - Próximamente')}
        >
          <Ionicons name="bar-chart-outline" size={24} color="#555" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Ver Entrenamientos</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Info', 'Configuración - Próximamente')}
        >
          <Ionicons name="settings-outline" size={24} color="#555" style={{ marginRight: 15 }} />
          <Text style={styles.menuText}>Configuración</Text>
          <Text style={styles.menuArrow}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityText}>Nuevo usuario registrado</Text>
            <Text style={styles.activityTime}>Hace 2 horas</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityText}>Coach agregó nuevo cliente</Text>
            <Text style={styles.activityTime}>Hace 5 horas</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={styles.activityDot} />
          <View style={styles.activityInfo}>
            <Text style={styles.activityText}>15 entrenamientos completados hoy</Text>
            <Text style={styles.activityTime}>Hace 8 horas</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>🚪 Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 20,
    margin: '1%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statIcon: {
    fontSize: 36,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  menuArrow: {
    fontSize: 24,
    color: '#999',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    backgroundColor: '#FFF0F0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
