'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, ArrowRight, Clock } from 'lucide-react';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';

const TRENDING = ['Necklace', 'Gold Hoops', 'Twisted Ring', 'Herringbone Bracelet', 'Pearl Earrings'];

export default function SearchModal() {
  const { searchOpen, closeSearch } = useUIStore();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
      const stored = JSON.parse(localStorage.getItem('sl-recent-searches') ?? '[]');
      setRecent(stored.slice(0, 5));
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSearch(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeSearch]);

  const handleSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recent.filter(r => r !== term)].slice(0, 5);
    localStorage.setItem('sl-recent-searches', JSON.stringify(updated));
    closeSearch();
    setQuery('');
    router.push(`/products?search=${encodeURIComponent(term)}`);
  };

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]" onClick={closeSearch}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div
        className="absolute top-0 left-0 right-0 bg-cream-50 shadow-hover animate-slide-left"
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); handleSearch(query); }}>
            <div className="flex items-center gap-4 border-b-2 border-charcoal-900 pb-4">
              <Search size={22} className="text-charcoal-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for jewelry..."
                className="flex-1 bg-transparent text-xl text-charcoal-900 placeholder:text-charcoal-300 outline-none font-body"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="text-charcoal-400 hover:text-charcoal-700 transition-colors">
                  <X size={20} />
                </button>
              )}
              <button type="button" onClick={closeSearch} className="text-charcoal-400 hover:text-charcoal-700 transition-colors ml-2">
                <X size={24} />
              </button>
            </div>
          </form>

          {/* Suggestions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {recent.length > 0 && (
              <div>
                <p className="text-2xs tracking-widest uppercase text-charcoal-400 mb-3 flex items-center gap-1">
                  <Clock size={11} /> Recent
                </p>
                <ul className="space-y-2">
                  {recent.map(term => (
                    <li key={term}>
                      <button
                        onClick={() => handleSearch(term)}
                        className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 group transition-colors"
                      >
                        <ArrowRight size={14} className="text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <p className="text-2xs tracking-widest uppercase text-charcoal-400 mb-3">Trending</p>
              <ul className="space-y-2">
                {TRENDING.map(term => (
                  <li key={term}>
                    <button
                      onClick={() => handleSearch(term)}
                      className="flex items-center gap-2 text-sm text-charcoal-600 hover:text-charcoal-900 group transition-colors"
                    >
                      <ArrowRight size={14} className="text-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
