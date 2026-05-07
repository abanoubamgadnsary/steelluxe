'use client';
import { useAuth } from '@/hooks/useAuth';
import { useWishlistStore } from '@/store';
import { useEffect } from 'react';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialise auth listener
  useAuth();
  return <>{children}</>;
}
