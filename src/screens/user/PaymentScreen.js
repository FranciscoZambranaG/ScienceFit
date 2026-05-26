import { Ionicons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import firebase, { db } from '../../../firebase.config';
import { AuthContext } from '../../context/AuthContext';

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

const CELL = 11;
const QR_SIZE = 21 * CELL;

function FakeQR() {
  return (
    <Svg width={QR_SIZE} height={QR_SIZE}>
      {QR_PATTERN.map((row, ri) =>
        row.map((cell, ci) =>
          cell ? (
            <Rect
              key={`${ri}-${ci}`}
              x={ci * CELL}
              y={ri * CELL}
              width={CELL - 1}
              height={CELL - 1}
              fill="#1a1a2e"
              rx={1.5}
            />
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

  const amount = plan.id === 'max' ? 20 : 40;

  const handlePaymentDone = async () => {
    setLoading(true);
    try {
      const now = firebase.firestore.Timestamp.now();

      await db.collection('users').doc(user.uid).update({
        plan: plan.id,
        planStatus: 'pending',
        planExpiry: null,
        paymentDate: now,
        paymentAmount: amount,
      });

      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();

      await db.collection('payments').add({
        userId: user.uid,
        userName: userData?.name || '',
        userEmail: userData?.email || user.email || '',
        plan: plan.id,
        amount,
        status: 'pending',
        createdAt: now,
      });

      setPaid(true);
    } catch (err) {
      console.error('Payment error:', err);
      Alert.alert('Error', 'No se pudo registrar el pago. Intenta nuevamente.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pago</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.planInfo}>
        <Text style={styles.planInfoName}>{plan.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={styles.planInfoPrice}>{plan.price}</Text>
          <Text style={styles.planInfoPeriod}>{plan.period}</Text>
        </View>
      </View>

      {paid ? (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="time-outline" size={52} color="#F57F17" />
          </View>
          <Text style={styles.successTitle}>Pago en Verificación</Text>
          <Text style={styles.successText}>
            Tu pago está siendo verificado. Te notificaremos cuando se confirme.
          </Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeButtonText}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.qrSection}>
            <Text style={styles.qrTitle}>Escanea este QR para pagar</Text>
            <View style={styles.qrContainer}>
              <FakeQR />
            </View>
            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>Instrucciones</Text>
              <Text style={styles.instructionsText}>
                1. Abre tu app de pagos{'\n'}
                2. Escanea el código QR{'\n'}
                3. Confirma el monto de {plan.price}/mes{'\n'}
                4. Presiona el botón de confirmación abajo
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.payButton, loading && { opacity: 0.7 }]}
              onPress={handlePaymentDone}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
              <Text style={styles.payButtonText}>
                {loading ? 'Procesando...' : 'Pago Realizado'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  planInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginBottom: 24,
    gap: 4,
  },
  planInfoName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  planInfoPrice: {
    fontSize: 36,
    fontWeight: '800',
    color: '#C62828',
    letterSpacing: -1,
  },
  planInfoPeriod: {
    fontSize: 16,
    color: '#999',
    marginLeft: 4,
  },
  qrSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
  },
  instructionsBox: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 26,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 12,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF8E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  successText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  homeButton: {
    backgroundColor: '#C62828',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
