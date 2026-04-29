import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { CustomButton } from '../../components/CustomButton';
import { CustomInput } from '../../components/CustomInput';
import { AuthContext } from '../../context/AuthContext';

export const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('usuario');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      console.log('Registrando usuario desde RegisterScreen:', email, selectedRole);
      const result = await register(email, password, selectedRole, { name });

      if (result.success) {
        console.log('Registro exitoso, role:', selectedRole);

        Alert.alert(
          'Éxito',
          'Cuenta creada exitosamente',
          [
            {
              text: 'OK',
              onPress: () => {
                if (selectedRole === 'usuario') {
                  console.log('Navegando a PhysicalData (onboarding)');
                  navigation.navigate('PhysicalData');
                } else {
                  console.log('Usuario admin/coach, esperando navegación automática');
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', result.error || 'No se pudo crear la cuenta');
      }
    } catch (error) {
      console.error('Error inesperado en registro:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>SCIENCEFIT</Text>
      <Text style={styles.subtitle}>Crear Cuenta</Text>
      <Text style={styles.description}>Completa el formulario para registrarte</Text>

      <View style={styles.formContainer}>
        <CustomInput
          placeholder="Nombre completo"
          value={name}
          onChangeText={setName}
        />

        <CustomInput
          placeholder="email@domain.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomInput
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Text style={styles.roleLabel}>Selecciona tu rol:</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'usuario' && styles.roleButtonSelected]}
            onPress={() => setSelectedRole('usuario')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons
                name="person-circle-outline"
                size={20}
                color={selectedRole === 'usuario' ? '#fff' : '#333'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.roleButtonText, selectedRole === 'usuario' && styles.roleButtonTextSelected]}>
                Usuario
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleButton, selectedRole === 'coach' && styles.roleButtonSelected]}
            onPress={() => setSelectedRole('coach')}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={20}
                color={selectedRole === 'coach' ? '#fff' : '#333'}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.roleButtonText, selectedRole === 'coach' && styles.roleButtonTextSelected]}>
                Coach
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <CustomButton
          title={loading ? "Creando cuenta..." : "Crear Cuenta"}
          onPress={handleRegister}
          disabled={loading}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>
            ¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia Sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 30,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
  },
  roleButtonSelected: {
    backgroundColor: '#D32F2F',
  },
  roleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  roleButtonTextSelected: {
    color: '#fff',
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
});
