'use client';
import { useState, useEffect } from 'react';
import { Search, Shield, User, Mail, Phone, Calendar } from 'lucide-react';
import { getAllUsers } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import type { UserProfile } from '@/types';
import { cn } from '@/lib/utils';

const DEMO_USERS: UserProfile[] = Array.from({ length: 10 }, (_, i) => ({
  uid: `user-${i}`,
  email: `customer${i + 1}@email.com`,
  displayName: ['Sara Mohamed', 'Nour Ahmed', 'Dina Khalil', 'Rana Tarek', 'Amira Hassan',
    'Heba Mostafa', 'Yasmine Ali', 'Rania Sayed', 'Mona Ibrahim', 'Laila Omar'][i],
  phone: `0101234567${i}`,
  savedAddresses: [],
  wishlist: Array.from({ length: i % 4 }, (_, j) => `p-${j}`),
  role: i === 0 ? 'admin' : 'customer',
  createdAt: new Date(Date.now() - i * 7 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

export default function AdminUsersPage() {
  const [users,  setUsers]  = useState<UserProfile[]>(DEMO_USERS);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<UserProfile | null>(null);

  useEffect(() => {
    getAllUsers().then(u => { if (u.length > 0) setUsers(u); }).catch(() => {});
  }, []);

  const filtered = users.filter(u =>
    u.displayName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-charcoal-900 font-light">Users</h1>
        <p className="text-charcoal-400 font-body text-sm mt-1">{users.length} registered customers</p>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search users..."
          className="w-full input-luxury rounded-xl pl-11 pr-4 py-3 text-sm font-body"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Users table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-cream-200 bg-cream-50">
              <tr>
                {['User', 'Email', 'Role', 'Wishlist', 'Joined'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-2xs uppercase tracking-widest text-charcoal-400 font-body font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map(user => (
                <tr
                  key={user.uid}
                  onClick={() => setSelected(user)}
                  className={cn(
                    'cursor-pointer hover:bg-cream-50 transition-colors',
                    selected?.uid === user.uid ? 'bg-gold-50' : ''
                  )}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-white text-xs font-display shrink-0">
                        {user.photoURL
                          ? <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                          : user.displayName[0]
                        }
                      </div>
                      <span className="text-sm font-medium text-charcoal-900 font-body">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-charcoal-500 font-body">{user.email}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      'px-2.5 py-1 rounded-full text-xs font-body font-medium capitalize',
                      user.role === 'admin' ? 'bg-gold-100 text-gold-700' : 'bg-cream-200 text-charcoal-600'
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-charcoal-500 font-body">{user.wishlist.length}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs text-charcoal-400 font-body">{formatDate(user.createdAt)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* User detail panel */}
        <div className="xl:col-span-1">
          {selected ? (
            <div className="bg-white rounded-2xl shadow-card p-5 sticky top-6">
              <div className="text-center mb-5 pb-5 border-b border-cream-200">
                <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center text-white font-display text-2xl mx-auto mb-3">
                  {selected.photoURL
                    ? <img src={selected.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                    : selected.displayName[0]
                  }
                </div>
                <h2 className="font-display text-xl text-charcoal-900 font-light">{selected.displayName}</h2>
                <span className={cn(
                  'px-2.5 py-1 rounded-full text-xs font-body font-medium capitalize mt-1 inline-block',
                  selected.role === 'admin' ? 'bg-gold-100 text-gold-700' : 'bg-cream-200 text-charcoal-600'
                )}>
                  {selected.role}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
                  <Mail size={14} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body">Email</p>
                    <p className="text-sm text-charcoal-700 font-body">{selected.email}</p>
                  </div>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
                    <Phone size={14} className="text-gold-500 shrink-0" />
                    <div>
                      <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body">Phone</p>
                      <p className="text-sm text-charcoal-700 font-body">{selected.phone}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl">
                  <Calendar size={14} className="text-gold-500 shrink-0" />
                  <div>
                    <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body">Member Since</p>
                    <p className="text-sm text-charcoal-700 font-body">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-cream-50 rounded-xl text-center">
                    <p className="font-display text-2xl text-charcoal-900">{selected.wishlist.length}</p>
                    <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body mt-0.5">Wishlist</p>
                  </div>
                  <div className="p-3 bg-cream-50 rounded-xl text-center">
                    <p className="font-display text-2xl text-charcoal-900">{selected.savedAddresses.length}</p>
                    <p className="text-2xs uppercase tracking-wider text-charcoal-400 font-body mt-0.5">Addresses</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-card p-8 text-center">
              <User size={32} className="text-charcoal-200 mx-auto mb-3" />
              <p className="text-charcoal-300 font-body text-sm">Click a user to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
