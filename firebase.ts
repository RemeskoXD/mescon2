
// @ts-ignore
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// Konfigurace pro Mescon Academy (Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCVuQeqEWhCMwSM40TE_6NYmjD-93ilKN8",
  authDomain: "mescon-academy.firebaseapp.com",
  projectId: "mescon-academy",
  storageBucket: "mescon-academy.firebasestorage.app",
  messagingSenderId: "457248475576",
  appId: "1:457248475576:web:d2a5eae3075003fcb1674d",
  measurementId: "G-B708KFX7WB"
};

// Inicializace Firebase
const app = initializeApp(firebaseConfig);

// Export služeb pro použití v aplikaci
export const auth = getAuth(app);

/**
 * Initialize Firestore with persistent cache and long polling.
 * 
 * 'experimentalForceLongPolling' is set to true to resolve connectivity issues 
 * often found in cloud IDEs and sandboxes where standard gRPC/WebSockets 
 * are blocked or throttled, leading to the "Backend didn't respond within 10 seconds" error.
 * 
 * persistentMultipleTabManager is added to ensure cache is shared correctly 
 * if the user opens the academy in multiple browser tabs.
 */
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  }),
  experimentalForceLongPolling: true
});
