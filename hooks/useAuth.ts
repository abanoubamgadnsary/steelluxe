'use client';
import { useEffect } from 'react';
import {
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, signOut, updateProfile, sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserProfile, getUserProfile } from '@/lib/db';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async fbUser => {
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid);
        setUser(profile ?? {
          uid: fbUser.uid,
          email: fbUser.email!,
          displayName: fbUser.displayName ?? 'Guest',
          photoURL: fbUser.photoURL ?? undefined,
          savedAddresses: [],
          wishlist: [],
          role: 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [setUser, setLoading]);

  const loginEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, ''));
      throw err;
    }
  };

  const registerEmail = async (email: string, password: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await createUserProfile(cred.user.uid, {
        uid: cred.user.uid, email, displayName: name,
        savedAddresses: [], wishlist: [], role: 'customer',
        createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
      toast.success('Account created! Welcome to SteelLuxe ✨');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, ''));
      throw err;
    }
  };

  const loginGoogle = async () => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const exists = await getUserProfile(cred.user.uid);
      if (!exists) {
        await createUserProfile(cred.user.uid, {
          uid: cred.user.uid,
          email: cred.user.email!,
          displayName: cred.user.displayName ?? 'User',
          photoURL: cred.user.photoURL ?? undefined,
          savedAddresses: [], wishlist: [], role: 'customer',
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        });
      }
      toast.success('Welcome!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      toast.error(message.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, ''));
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    toast.success('See you soon!');
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent!');
  };

  return { user, loading, loginEmail, registerEmail, loginGoogle, logout, resetPassword };
}
