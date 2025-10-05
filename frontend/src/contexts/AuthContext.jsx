// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as fbSignOut,
  onAuthStateChanged
} from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { uid, name, email, avatar, token }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken(); // idToken to send to server if needed
        setUser({
          uid: fbUser.uid,
          name: fbUser.displayName,
          email: fbUser.email,
          avatar: fbUser.photoURL,
          token
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Try popup first, fallback to redirect (some browsers block popups)
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const result = await signInWithPopup(auth, provider);
      // onAuthStateChanged will update user, but you can also read result.user
      return result;
    } catch (err) {
      // If popup blocked or other issue, fallback to redirect
      console.warn("Popup sign-in failed, falling back to redirect:", err);
      await signInWithRedirect(auth, provider);
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
