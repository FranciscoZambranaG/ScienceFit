import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Same Firebase project as the React Native app (sciencefitoficialv2)
const firebaseConfig = {
  apiKey: 'AIzaSyATJDKL595fgoz3eGVVDkBYbmhxte8MW3Y',
  authDomain: 'sciencefitoficialv2.firebaseapp.com',
  projectId: 'sciencefitoficialv2',
  storageBucket: 'sciencefitoficialv2.firebasestorage.app',
  messagingSenderId: '516047184578',
  appId: '1:516047184578:web:6771378ffd2f629b60915b',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
