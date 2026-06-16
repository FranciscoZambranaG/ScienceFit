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
  TextInput,
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

const ROLE_CONFIG = {
  admin: { label: 'Administrador', icon: 'crown-outline', isMC: true },
  coach: { label: 'Coach', icon: 'dumbbell', isMC: true },
  usuario: { label: 'Usuario', icon: 'person-outline', isMC: false },
};

export const ProfileScreen = ({ navigation }) => {
  const { user, logout, userRole } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

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
      await db.collection('users').doc(user.uid).update({ name });
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
        { text: 'Salir', onPress: async () => { await logout(); } },
      ]
    );
  };

  const role = ROLE_CONFIG[userRole] || ROLE_CONFIG.usuario;
  const initials = name ? name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  const pressIn = () => Animated.timing(scaleBtn, { toValue: 0.97, duration: 100, useNativeDriver: true }).start();
  const pressOut = () => Animated.timing(scaleBtn, { toValue: 1, duration: 100, useNativeDriver: true }).start();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Perfil</Text>
            <TouchableOpacity
              style={styles.editToggleBtn}
              onPress={() => editing ? null : setEditing(true)}
            >
              {!editing && <Ionicons name="pencil-outline" size={18} color={COLORS.textSecondary} />}
            </TouchableOpacity>
          </View>

          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.roleBadge}>
              {role.isMC
                ? <MaterialCommunityIcons name={role.icon} size={13} color={COLORS.primary} />
                : <Ionicons name={role.icon} size={13} color={COLORS.primary} />
              }
              <Text style={styles.roleBadgeText}>{role.label}</Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nombre</Text>
              <View style={[styles.inputWrap, !editing && styles.inputWrapDisabled, editing && focusedField === 'name' && styles.inputWrapFocused]}>
                <TextInput
                  style={[styles.input, !editing && styles.inputDisabled]}
                  placeholder="Tu nombre"
                  placeholderTextColor={COLORS.textTertiary}
                  value={name}
                  onChangeText={setName}
                  editable={editing}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                />
                {editing && <Ionicons name="create-outline" size={16} color={COLORS.textTertiary} />}
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <View style={[styles.inputWrap, styles.inputWrapDisabled]}>
                <TextInput
                  style={[styles.input, styles.inputDisabled]}
                  value={email}
                  editable={false}
                />
                <Ionicons name="lock-closed-outline" size={14} color={COLORS.textTertiary} />
              </View>
            </View>

            {editing ? (
              <View style={{ gap: 10, marginTop: 8 }}>
                <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
                  <TouchableOpacity
                    style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                    onPress={handleUpdate}
                    onPressIn={pressIn}
                    onPressOut={pressOut}
                    disabled={loading}
                    activeOpacity={1}
                  >
                    <Text style={styles.primaryBtnText}>{loading ? 'Guardando...' : 'Guardar cambios'}</Text>
                  </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => { setEditing(false); loadUserData(); }}
                >
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setEditing(true)}
              >
                <Ionicons name="pencil-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
                <Text style={styles.primaryBtnText}>Editar perfil</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => navigation.navigate('Plans')}
              activeOpacity={0.7}
            >
              <View style={styles.actionRowLeft}>
                <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
                  <Ionicons name="diamond-outline" size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.actionRowLabel}>Ver planes</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={COLORS.textTertiary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dangerSection}>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
              <Ionicons name="log-out-outline" size={18} color={COLORS.primary} />
              <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
            </TouchableOpacity>
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  editToggleBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  formSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 0,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.1,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
  },
  inputWrapDisabled: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  inputWrapFocused: {
    borderColor: COLORS.borderFocus,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.textPrimary,
    height: '100%',
  },
  inputDisabled: {
    color: COLORS.textTertiary,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  cancelBtn: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  actionsSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRowLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  dangerSection: {
    paddingHorizontal: 24,
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
});
