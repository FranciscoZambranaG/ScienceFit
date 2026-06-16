import { Ionicons } from '@expo/vector-icons';
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
import Svg, { Rect } from 'react-native-svg';
import firebase, { db } from '../../../firebase.config';
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
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
};

const QR_PATTERN = [
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0,0],
  [1,0,1,1,0,1,1,1,0,1,1,0,1,1,0,1,0,1,1,0,1],
  [0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,1,0,0,1,0],
  [1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1],
  [0,1,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,0],
  [1,0,1,0,1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1],
  [0,0,0,0,0,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0],
  [1,1,1,1,1,1,1,0,0,1,0,1,0,0,1,0,1,1,0,1,0],
  [1,0,0,0,0,0,1,0,1,0,0,0,1,1,0,0,1,0,0,1,1],
  [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,0,1,1,0,0,1],
  [1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1,0,0,1,1,0],
  [1,0,1,1,1,0,1,0,1,1,0,0,1,0,0,0,1,0,1,0,1],
  [1,0,0,0,0,0,1,0,0,0,1,1,0,1,1,0,0,1,0,0,0],
  [1,1,1,1,1,1,1,0,1,0,0,1,0,0,0,1,1,0,1,0,1],
];

const CELL = 10;
const QR_SIZE = 21 * CELL;

function FakeQR() {
  return (
    <Svg width={QR_SIZE} height={QR_SIZE}>
      {QR_PATTERN.map((row, ri) =>
        row.map((cell, ci) =>
          cell ? (
            <Rect key={`${ri}-${ci}`} x={ci * CELL} y={ri * CELL} width={CELL - 1} height={CELL - 1} fill={COLORS.textPrimary} rx={1} />
          ) : null
        )
      )}
    </Svg>
  );
}

export const PaymentScreen = ({ navigation, route }) => {
  const { plan } = route.params;
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleBtn = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  const amount = plan.id === 'max' ? 20 : 40;

  const handlePaymentDone = async () => {
    setLoading(true);
    try {
      const now = firebase.firestore.Timestamp.now();
      await db.collection('users').doc(user.uid).update({
        plan: plan.id, planStatus: 'pending', planExpiry: null,
        paymentDate: now, paymentAmount: amount,
      });
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      await db.collection('payments').add({
        userId: user.uid,
        userName: userData?.name || '',
        userEmail: userData?.email || user.email || '',
        plan: plan.id, amount, status: 'pending', createdAt: now,
      });
      setPaid(true);
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'No se pudo registrar el pago. Intenta nuevamente.');
    }
    setLoading(false);
  };

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
            <Text style={styles.headerTitle}>Pago</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.planSummary}>
            <Text style={styles.planSummaryName}>{plan.name}</Text>
            <View style={styles.planSummaryPrice}>
              <Text style={styles.planSummaryAmount}>{plan.price}</Text>
              <Text style={styles.planSummaryPeriod}>{plan.period}</Text>
            </View>
          </View>

          {paid ? (
            <View style={styles.successContainer}>
              <View style={styles.successIconWrap}>
                <Ionicons name="time-outline" size={44} color={COLORS.warning} />
              </View>
              <Text style={styles.successTitle}>Pago en verificación</Text>
              <Text style={styles.successSubtitle}>
                Tu pago está siendo verificado. Te notificaremos cuando se confirme.
              </Text>
              <TouchableOpacity
                style={styles.homeBtn}
                onPress={() => navigation.navigate('Home')}
                activeOpacity={0.8}
              >
                <Text style={styles.homeBtnText}>Volver al inicio</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.qrSection}>
                <Text style={styles.qrTitle}>Escanea para pagar</Text>
                <View style={styles.qrCard}>
                  <FakeQR />
                </View>
                <View style={styles.instructionsCard}>
                  <Text style={styles.instructionsTitle}>INSTRUCCIONES</Text>
                  <View style={styles.instructionsList}>
                    {[
                      'Abre tu app de pagos',
                      'Escanea el código QR',
                      `Confirma el monto de ${plan.price}/mes`,
                      'Presiona el botón de confirmación abajo',
                    ].map((step, i) => (
                      <View key={i} style={styles.instructionRow}>
                        <View style={styles.instructionNum}>
                          <Text style={styles.instructionNumText}>{i + 1}</Text>
                        </View>
                        <Text style={styles.instructionText}>{step}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.footer}>
                <Animated.View style={{ transform: [{ scale: scaleBtn }] }}>
                  <TouchableOpacity
                    style={[styles.payBtn, loading && styles.payBtnDisabled]}
                    onPress={handlePaymentDone}
                    onPressIn={pressIn}
                    onPressOut={pressOut}
                    disabled={loading}
                    activeOpacity={1}
                  >
                    <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                    <Text style={styles.payBtnText}>{loading ? 'Procesando...' : 'Ya realicé el pago'}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </>
          )}
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
    paddingBottom: 12,
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
  planSummary: {
    marginHorizontal: 24,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  planSummaryName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
    letterSpacing: -0.1,
  },
  planSummaryPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planSummaryAmount: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -2,
  },
  planSummaryPeriod: {
    fontSize: 16,
    color: COLORS.textTertiary,
    marginLeft: 4,
  },
  qrSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  qrCard: {
    padding: 20,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  instructionsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 18,
    width: '100%',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  instructionsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textTertiary,
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  instructionsList: {
    gap: 12,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionNum: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  payBtn: {
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  payBtnDisabled: {
    opacity: 0.6,
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  successIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: COLORS.warningLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  successSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  homeBtn: {
    height: 52,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
