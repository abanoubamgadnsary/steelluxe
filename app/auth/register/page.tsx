'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  name:            z.string().min(2, 'Name must be at least 2 characters'),
  email:           z.string().email('Invalid email'),
  password:        z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { registerEmail, loginGoogle } = useAuth();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try { await registerEmail(data.email, data.password, data.name); router.push('/'); }
    catch { /* error already toasted */ }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <span className="font-display text-3xl font-light tracking-[0.12em] text-charcoal-900">
              STEEL<span className="text-gradient-gold">LUXE</span>
            </span>
          </Link>
          <h1 className="font-display text-3xl text-charcoal-900 font-light mb-2">Create Account</h1>
          <p className="text-charcoal-400 font-body text-sm">Join the SteelLuxe community</p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-8">
          <button
            onClick={async () => { try { await loginGoogle(); router.push('/'); } catch {} }}
            className="w-full flex items-center justify-center gap-3 py-3.5 border border-cream-300 rounded-xl text-sm font-body font-medium text-charcoal-700 hover:border-gold-300 hover:bg-cream-50 transition-all duration-200 mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-cream-200" />
            <span className="text-xs text-charcoal-400 font-body">or</span>
            <div className="flex-1 h-px bg-cream-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input {...register('name')} placeholder="Sara Mohamed" className="w-full input-luxury rounded-xl pl-11 pr-4 py-3 text-sm font-body" />
              </div>
              {errors.name && <p className="text-red-400 text-xs mt-1 font-body">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input {...register('email')} type="email" placeholder="your@email.com" className="w-full input-luxury rounded-xl pl-11 pr-4 py-3 text-sm font-body" />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1 font-body">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input {...register('password')} type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" className="w-full input-luxury rounded-xl pl-11 pr-12 py-3 text-sm font-body" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1 font-body">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
                <input {...register('confirmPassword')} type={showPwd ? 'text' : 'password'} placeholder="Repeat password" className="w-full input-luxury rounded-xl pl-11 pr-4 py-3 text-sm font-body" />
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 font-body">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-full font-body font-medium text-sm tracking-wide mt-2 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-charcoal-500 mt-6 font-body">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-gold-500 hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
