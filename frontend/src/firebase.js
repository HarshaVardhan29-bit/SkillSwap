import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  setPersistence 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0IdcGwdjwq7VA9OLMB6l-Eqyg_Om_s-o",
  authDomain: "skillswap-2006.firebaseapp.com",
  projectId: "skillswap-2006",
  storageBucket: "skillswap-2006.firebasestorage.app",
  messagingSenderId: "406467593112",
  appId: "1:406467593112:web:d5dae59b04dc23f3fba1ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Set persistence to LOCAL (survives browser restarts and redirects)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Firebase persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("❌ Error setting Firebase persistence:", error);
  });

// Configure Google Provider
export const googleProvider = new GoogleAuthProvider();

// Add custom parameters to Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account selection
  access_type: 'online',
});

// Add scopes if needed
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app;
