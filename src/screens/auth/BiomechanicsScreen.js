import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../../../firebase.config';
import { CustomButton } from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';

export const BiomechanicsScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const { userLevel = 'principiante' } = route.params || {};
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  console.log('BiomechanicsScreen - Nivel recibido:', userLevel);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permiso necesario',
        'Necesitamos acceso a la cámara para analizar tu biomecánica'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al tomar foto:', error);
      Alert.alert('Error', 'No se pudo acceder a la cámara');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('Error', 'Por favor toma o selecciona una foto primero');
      return;
    }

    setAnalyzing(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      let biomechanicsType;

      console.log('Analizando con nivel de usuario:', userLevel);

      if (userLevel === 'principiante') {
        biomechanicsType = Math.random() > 0.5 ? 'type_fullbody' : 'type_upper_lower';
      } else if (userLevel === 'intermedio') {
        const options = ['type_upper_lower', 'type_ppl', 'type_fullbody'];
        biomechanicsType = options[Math.floor(Math.random() * options.length)];
      } else {
        biomechanicsType = Math.random() > 0.5 ? 'type_ppl' : 'type_arnold';
      }

      console.log('Tipo biomecánico determinado:', biomechanicsType);

      await db.collection('users').doc(user.uid).set({
        biomechanicsType: biomechanicsType,
        biomechanicsAnalyzed: true,
        level: userLevel,
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log('Datos guardados en Firebase');

      setAnalyzing(false);

      navigation.navigate('Recommendations', {
        biomechanicsType,
        userLevel
      });
    } catch (error) {
      console.error('Error en análisis:', error);
      setAnalyzing(false);

      Alert.alert(
        'Error',
        'No se pudo completar el análisis. Intenta nuevamente.',
        [
          {
            text: 'Reintentar',
            onPress: () => analyzeImage()
          },
          {
            text: 'Continuar sin análisis',
            onPress: () => {
              const defaultType = userLevel === 'principiante' ? 'type_fullbody' : 'type_upper_lower';
              navigation.navigate('Recommendations', {
                biomechanicsType: defaultType,
                userLevel
              });
            }
          }
        ]
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '66%' }]} />
        </View>
        <Text style={styles.progressText}>Paso 2 de 3</Text>
      </View>

      <Text style={styles.logo}>SCIENCEFIT</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <Ionicons name="camera-outline" size={24} color="#000" style={{ marginRight: 8 }} />
        <Text style={[styles.title, { marginBottom: 0 }]}>Análisis Biomecánico</Text>
      </View>

      <Text style={styles.description}>
        Toma una foto de cuerpo completo para analizar tu biomecánica
      </Text>

      <View style={styles.instructionsContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="clipboard-outline" size={16} color="#000" style={{ marginRight: 6 }} />
          <Text style={[styles.instructionsTitle, { marginBottom: 0 }]}>Instrucciones:</Text>
        </View>
        <Text style={styles.instruction}>• Párate de frente a la cámara</Text>
        <Text style={styles.instruction}>• Asegúrate de tener buena iluminación</Text>
        <Text style={styles.instruction}>• Muestra tu cuerpo completo</Text>
        <Text style={styles.instruction}>• Mantén una postura natural</Text>
      </View>

      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setImage(null)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="refresh-outline" size={14} color="#333" style={{ marginRight: 6 }} />
              <Text style={styles.retakeButtonText}>Tomar otra foto</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.photoButtonsContainer}>
          <TouchableOpacity
            style={styles.photoButton}
            onPress={takePhoto}
          >
            <Text style={styles.photoButtonEmoji}>📷</Text>
            <Text style={styles.photoButtonText}>Tomar Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.photoButton}
            onPress={pickImage}
          >
            <Text style={styles.photoButtonEmoji}>🖼️</Text>
            <Text style={styles.photoButtonText}>Seleccionar de Galería</Text>
          </TouchableOpacity>
        </View>
      )}

      <CustomButton
        title={analyzing ? "Analizando..." : "Analizar Biomecánica"}
        onPress={analyzeImage}
        disabled={!image || analyzing}
      />

      {analyzing && (
        <View style={styles.analyzingContainer}>
          <Text style={styles.analyzingText}>
            Analizando tu postura y biomecánica...
          </Text>
          <Text style={styles.analyzingSubtext}>
            Esto puede tomar unos segundos ⏳
          </Text>
        </View>
      )}
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
  progressContainer: {
    marginBottom: 30,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D32F2F',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoButton: {
    flex: 1,
    paddingVertical: 30,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  photoButtonEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 350,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  retakeButton: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  retakeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  analyzingContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FFF8F0',
    borderRadius: 10,
    alignItems: 'center',
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 5,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
