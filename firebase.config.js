import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyATJDKL595fgoz3eGVVDkBYbmhxte8MW3Y",
  authDomain: "sciencefitoficialv2.firebaseapp.com",
  projectId: "sciencefitoficialv2",
  storageBucket: "sciencefitoficialv2.firebasestorage.app",
  messagingSenderId: "516047184578",
  appId: "1:516047184578:web:6771378ffd2f629b60915b"
};


// Inicializar Firebase solo si no está ya inicializado
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase inicializado correctamente');
} else {
  console.log('ℹ️ Firebase ya estaba inicializado');
}

// Obtener referencias a los servicios
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('✅ Firebase y Firestore inicializados');

export { auth, db, storage };
export default firebase;