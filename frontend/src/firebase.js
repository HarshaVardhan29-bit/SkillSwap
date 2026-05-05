import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB0IdcGwdjwq7VA9OLMB6l-Eqyg_Om_s-o",
  authDomain: "skillswap-2006.firebaseapp.com",
  projectId: "skillswap-2006",
  storageBucket: "skillswap-2006.firebasestorage.app",
  messagingSenderId: "406467593112",
  appId: "1:406467593112:web:d5dae59b04dc23f3fba1ed"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Check if mobile browser
export const isMobileBrowser = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const signInWithGoogle = async () => {
  if (isMobileBrowser()) {
    // Use redirect for mobile - returns null, result handled separately
    await signInWithRedirect(auth, googleProvider);
    return null;
  }
  // Use popup for desktop
  return signInWithPopup(auth, googleProvider);
};

export { getRedirectResult };
