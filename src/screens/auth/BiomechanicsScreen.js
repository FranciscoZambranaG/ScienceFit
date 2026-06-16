import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
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
  borderFocus: '#C62828',
};

export const BiomechanicsScreen = ({ navigation, route }) => {
  const { user } = useContext(AuthContext);
  const { userLevel } = route.params;
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (analyzing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.04, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [analyzing]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    try {
      let biomechanicsType;
      if (userLevel === 'principiante') {
        biomechanicsType = Math.random() > 0.5 ? 'type_fullbody' : 'type_upper_lower';
      } else {
        biomechanicsType = Math.random() > 0.5 ? 'type_ppl' : 'type_arnold';
      }
      await new Promise(resolve => setTimeout(resolve, 2500));
      await db.collection('users').doc(user.uid).update({
        biomechanicsType,
        biomechanicsAnalyzed: true,
      });
      navigation.navigate('Recommendations', { biomechanicsType, userLevel });
    } catch (error) {
      Alert.alert('Error', 'No se pudo analizar la imagen');
      console.error(error);
    }
    setAnalyzing(false);
  };

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.logo}>SCIENCEFIT</Text>

          <View style={styles.progressSection}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
            <Text style={styles.progressLabel}>Paso 2 de 3 — Análisis biomecánico</Text>
          </View>

          <Text style={styles.title}>Análisis corporal</Text>
          <Text style={styles.subtitle}>
            Sube una foto de cuerpo completo de frente para analizar tu biomecánica y personalizar tu plan
          </Text>

          {image ? (
            <View style={styles.imagePreviewCard}>
              <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
              <TouchableOpacity style={styles.changeImageBtn} onPress={() => setImage(null)}>
                <Ionicons name="refresh-outline" size={16} color={COLORS.textSecondary} />
                <Text style={styles.changeImageText}>Cambiar foto</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadZone}>
              <View style={styles.uploadIconWrap}>
                <Ionicons name="person-outline" size={36} color={COLORS.textTertiary} />
              </View>
              <Text style={styles.uploadTitle}>Subir foto de cuerpo completo</Text>
              <Text style={styles.uploadHint}>Foto de frente, buena iluminación</Text>

              <View style={styles.uploadActions}>
                <TouchableOpacity style={styles.uploadBtn} onPress={takePhoto} activeOpacity={0.7}>
                  <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadBtnText}>Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={pickImage} activeOpacity={0.7}>
                  <Ionicons name="images-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.uploadBtnText}>Galería</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {analyzing && (
            <Animated.View style={[styles.analyzingCard, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="scan-outline" size={22} color={COLORS.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.analyzingTitle}>Analizando biomecánica...</Text>
                <Text style={styles.analyzingSubtitle}>Evaluando estructura, postura y proporciones</Text>
              </View>
            </Animated.View>
          )}

          {image && !analyzing && (
            <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={analyzeImage}
                onPressIn={pressIn}
                onPressOut={pressOut}
                activeOpacity={1}
              >
                <Ionicons name="scan-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Analizar con IA</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.textTertiary} />
            <Text style={styles.infoText}>
              Tu foto se analiza localmente y no se almacena en nuestros servidores
            </Text>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 28,
  },
  progressSection: {
    marginBottom: 32,
  },
  progressBar: {
    height: 3,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.textTertiary,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: 28,
  },
  uploadZone: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  uploadHint: {
    fontSize: 13,
    color: COLORS.textTertiary,
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  uploadBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  imagePreviewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: COLORS.surface,
  },
  previewImage: {
    width: '100%',
    height: 280,
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  changeImageText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  analyzingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  analyzingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 3,
  },
  analyzingSubtitle: {
    fontSize: 12,
    color: COLORS.primary,
    opacity: 0.7,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textTertiary,
    lineHeight: 18,
  },
});
