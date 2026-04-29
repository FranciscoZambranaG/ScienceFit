import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../../firebase.config';
import { AuthContext } from '../../context/AuthContext';

// Información detallada de cada split
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

export const HomeScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSplit, setSelectedSplit] = useState(null);

  useEffect(() => {
    loadUserData();
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
        {
          text: 'Salir',
          onPress: async () => {
            await logout();
          }
        },
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {userData?.name || 'Usuario'}</Text>
          <Text style={styles.subGreeting}>¡Es hora de entrenar!</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={28} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Sección de Entrenamiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Entrenamiento</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddWorkout')}
          >
            <Ionicons name="add-circle-outline" size={30} color="#333" style={{ marginBottom: 10 }} />
            <Text style={styles.buttonText}>Agregar{'\n'}Entrenamiento</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('ViewWorkouts')}
          >
            <Ionicons name="bar-chart-outline" size={30} color="#333" style={{ marginBottom: 10 }} />
            <Text style={styles.buttonText}>Ver{'\n'}Entrenamientos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('IMC')}
          >
            <Text style={styles.buttonIcon}>📏</Text>
            <Text style={styles.buttonText}>Medición{'\n'}IMC</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón ScienceIA */}
      <TouchableOpacity
        style={styles.scienceIAButton}
        onPress={() => navigation.navigate('ScienceIA')}
      >
        <MaterialCommunityIcons name="robot-outline" size={40} color="#fff" style={{ marginRight: 15 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.scienceIATitle}>ScienceIA</Text>
          <Text style={styles.scienceIASubtitle}>Análisis de técnica con IA</Text>
        </View>
        <Text style={styles.arrowIcon}>→</Text>
      </TouchableOpacity>

      {/* Rutinas Semanales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rutinas Semanales</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {Object.keys(SPLIT_INFO).map((splitType) => {
            const split = SPLIT_INFO[splitType];
            return (
              <View key={splitType} style={styles.splitCardWrapper}>
                <TouchableOpacity
                  style={styles.splitCard}
                  onPress={() => navigateToSplit(splitType)}
                >
                  <MaterialCommunityIcons name={split.icon} size={40} color="#333" style={{ marginBottom: 10 }} />
                  <Text style={styles.splitName}>{split.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.infoButton}
                  onPress={() => showSplitInfo(splitType)}
                >
                  <Ionicons name="information-circle" size={22} color="#fff" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Estudios Científicos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estudios Científicos</Text>
        <View style={styles.studiesContainer}>
          <View style={styles.studyCard}>
            <View style={styles.studyHeader}>
              <Text style={styles.studyAuthor}>Jeff Nipard</Text>
              <Text style={styles.studyDate}>Hoy</Text>
            </View>
            <Text style={styles.studyTitle}>El mejor split para hipertrofia</Text>
            <View style={styles.studyImage}>
              <Text style={styles.studyImagePlaceholder}>📄</Text>
            </View>
          </View>

          <View style={styles.studyCard}>
            <View style={styles.studyHeader}>
              <Text style={styles.studyAuthor}>Ramon Dino</Text>
              <Text style={styles.studyDate}>Ayer</Text>
            </View>
            <Text style={styles.studyTitle}>Eficiencia del RIR</Text>
            <View style={styles.studyImage}>
              <Text style={styles.studyImagePlaceholder}>📄</Text>
            </View>
          </View>

          <View style={styles.studyCard}>
            <View style={styles.studyHeader}>
              <Text style={styles.studyAuthor}>Mike Israetel</Text>
              <Text style={styles.studyDate}>2d</Text>
            </View>
            <Text style={styles.studyTitle}>Volumen óptimo</Text>
            <View style={styles.studyImage}>
              <Text style={styles.studyImagePlaceholder}>📄</Text>
            </View>
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

      {/* Espacio adicional al final */}
      <View style={{ height: 40 }} />

      {/* Modal de información del split */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              {selectedSplit && (
                <MaterialCommunityIcons name={selectedSplit.icon} size={50} color="#4A90E2" style={{ marginBottom: 10 }} />
              )}
              <Text style={styles.modalTitle}>{selectedSplit?.fullNameSpanish}</Text>
              <Text style={styles.modalSubtitle}>({selectedSplit?.fullName})</Text>
            </View>

            <View style={styles.modalFrequency}>
              <Text style={styles.frequencyLabel}>Frecuencia semanal:</Text>
              <Text style={styles.frequencyValue}>{selectedSplit?.daysPerWeek} días</Text>
            </View>

            <Text style={styles.modalDescription}>
              {selectedSplit?.description}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  buttonIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
  scienceIAButton: {
    flexDirection: 'row',
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  scienceIAIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  scienceIATitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scienceIASubtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
    opacity: 0.9,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  splitCardWrapper: {
    marginRight: 20,
    marginTop: 8,
    paddingTop: 8,
    paddingRight: 8,
    position: 'relative',
    overflow: 'visible',
  },
  splitCard: {
    width: 100,
    height: 120,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'visible',
  },
  splitIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  splitName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
  infoButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#4A90E2',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoButtonText: {
    fontSize: 16,
  },
  studiesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  studyCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    padding: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  studyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  studyAuthor: {
    fontSize: 11,
    fontWeight: '600',
    color: '#333',
  },
  studyDate: {
    fontSize: 10,
    color: '#999',
  },
  studyTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 10,
    color: '#333',
  },
  studyImage: {
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  studyImagePlaceholder: {
    fontSize: 30,
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
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  modalFrequency: {
    backgroundColor: '#F0F8FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  frequencyLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  frequencyValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 25,
  },
  modalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
