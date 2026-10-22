import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

import { environment } from '../../../environments/environment';

export const firebaseApp: FirebaseApp = initializeApp(environment.firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const realtimeDatabase = getDatabase(firebaseApp);
