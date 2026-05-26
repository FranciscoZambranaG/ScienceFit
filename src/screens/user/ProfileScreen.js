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
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { AuthContext } from '../../context/AuthContext';

export const ProfileScreen = ({ navigation }) => {
  const { user, logout, userRole } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          setUserData(data);
          setName(data.name || '');
          setEmail(data.email || '');
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleUpdate = async () => {
    if (!name) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }

    setLoading(true);
    try {
      await db.collection('users').doc(user.uid).update({
        name: name,
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      setEditing(false);
      loadUserData();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
    setLoading(false);
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
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.profileIconContainer}>
        <View style={styles.profileIconLarge}>
          <Ionicons name="person-circle-outline" size={80} color="#999" />
        </View>
      </View>

      <View style={styles.roleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 }}>
          {userRole === 'admin' ? (
            <MaterialCommunityIcons name="crown-outline" size={16} color="#666" style={{ marginRight: 6 }} />
          ) : userRole === 'coach' ? (
            <MaterialCommunityIcons name="dumbbell" size={16} color="#666" style={{ marginRight: 6 }} />
          ) : (
            <Ionicons name="person-circle-outline" size={16} color="#666" style={{ marginRight: 6 }} />
          )}
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#666' }}>
            {userRole === 'admin' ? 'Administrador' :
             userRole === 'coach' ? 'Coach' :
             'Usuario'}
          </Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre</Text>
        <CustomInput
          placeholder="Tu nombre"
          value={name}
          onChangeText={setName}
          editable={editing}
          style={!editing && styles.disabledInput}
        />

        <Text style={styles.label}>Email</Text>
        <CustomInput
          placeholder="tu@email.com"
          value={email}
          editable={false}
          style={styles.disabledInput}
        />

        {editing ? (
          <View style={styles.buttonContainer}>
            <CustomButton
              title={loading ? "Guardando..." : "Guardar Cambios"}
              onPress={handleUpdate}
              disabled={loading}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setEditing(false);
                loadUserData();
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CustomButton
            title="Editar Perfil"
            onPress={() => setEditing(true)}
          />
        )}
      </View>

      <View style={styles.plansButtonContainer}>
        <TouchableOpacity
          style={styles.plansButton}
          onPress={() => navigation.navigate('Plans')}
        >
          <Ionicons name="diamond-outline" size={20} color="#C62828" />
          <Text style={styles.plansButtonText}>Ver Planes</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dangerZone}>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
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
  profileIconContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  profileIconLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIconText: {
    fontSize: 60,
  },
  roleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#333',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  buttonContainer: {
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#D32F2F',
    fontWeight: '600',
  },
  plansButtonContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  plansButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  plansButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C62828',
  },
  dangerZone: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
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
