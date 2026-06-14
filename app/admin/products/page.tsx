'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Upload, Search, X, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { DEMO_PRODUCTS, formatPrice, toSlug } from '@/lib/utils';
import { getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } from '@/lib/db';
import { cn } from '@/lib/utils';
import type { Product, Category } from '@/types';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  comparePrice: z.number().optional(),
  category: z.enum(['necklaces', 'earrings', 'rings', 'bracelets']),
  description: z.string().min(10),
  shortDescription: z.string().min(5),
  material: z.string().min(2),
  stock: z.number().int().min(0),
  discount: z.number().min(0).max(100).optional(),
  isNew: z.boolean(),
  isBestSeller: z.boolean(),
  isFeatured: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { isNew: false, isBestSeller: false, isFeatured: false, stock: 0, price: 0 },
  });

  // ✅ بيقرأ من Firestore الحقيقي
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { products: firestoreProducts } = await getProducts({}, 100);
        setProducts(firestoreProducts);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openCreate = () => {
    setEditing(null); setImages([]); reset(); setModal(true);
  };
  const openEdit = (product: Product) => {
    setEditing(product); setImages(product.images);
    reset({
      name: product.name, price: product.price, category: product.category as Category,
      description: product.description, shortDescription: product.shortDescription,
      material: product.material, stock: product.stock, isNew: product.isNew,
      isBestSeller: product.isBestSeller, isFeatured: product.isFeatured,
      discount: product.discount, comparePrice: product.comparePrice,
    });
    setModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(f => uploadProductImage(f)));
      setImages(prev => [...prev, ...urls]);
      toast.success('Images uploaded!');
    } catch {
      // Demo mode: use placeholder URLs
      const demoUrls = files.map((f, i) => `https://images.unsplash.com/photo-160079?w=800&demo=${Date.now()}_${i}`);
      setImages(prev => [...prev, ...demoUrls]);
      toast.success('Images added (demo mode)');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      const productData = {
        ...data,
        slug: toSlug(data.name),
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'],
        tags: [data.category, data.material.toLowerCase()],
        sold: editing?.sold ?? 0,
        rating: editing?.rating ?? 0,
        reviewCount: editing?.reviewCount ?? 0,
      };
      if (editing) {
        await updateProduct(editing.id, productData).catch(() => { });
        setProducts(ps => ps.map(p => p.id === editing.id ? { ...p, ...productData } as Product : p));
        toast.success('Product updated!');
      } else {
        const id = await createProduct({ ...productData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as any).catch(() => `demo-${Date.now()}`);
        const newProduct = { id, ...productData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } as Product;
        setProducts(ps => [newProduct, ...ps]);
        toast.success('Product created!');
      }
      setModal(false);
    } catch (err) {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    // مش بيعمل redirect
    if (!confirm('Delete this product?')) return;

    try {
      // امسح من Firestore
      await deleteProduct(id).catch(() => { });

      // امسح من الـ state مباشرة بدون reload
      setProducts(prev => prev.filter(p => p.id !== id));

      // لو المنتج المحذوف كان في المودال — اقفله
      if (editing?.id === id) {
        setEditing(null);
        setModal(false);
      }

      toast.success('Product deleted successfully');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal-900 font-light">Products</h1>
          <p className="text-charcoal-400 font-body text-sm mt-1">{products.length} items in catalogue</p>
        </div>
        <button onClick={openCreate} className="btn-gold px-5 py-2.5 rounded-full text-sm font-body font-medium flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full input-luxury rounded-xl pl-11 pr-4 py-3 text-sm font-body max-w-md"
        />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-cream-200 bg-cream-50">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-2xs uppercase tracking-widest text-charcoal-400 font-body font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-100">
              {filtered.map(product => {
                const price = product.discount
                  ? Math.round(product.price * (1 - product.discount / 100))
                  : product.price;
                return (
                  <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-cream-200" />
                        <div>
                          <p className="text-sm font-medium text-charcoal-900 font-body">{product.name}</p>
                          <p className="text-xs text-charcoal-400 font-body">{product.material}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-body capitalize px-2.5 py-1 rounded-full bg-cream-200 text-charcoal-600">{product.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium font-body">{formatPrice(price)}</p>
                        {product.discount && <p className="text-xs text-green-600 font-body">-{product.discount}%</p>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn('text-sm font-body font-medium', product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-amber-500' : 'text-green-600')}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {product.isNew && <span className="badge-new text-2xs">New</span>}
                        {product.isBestSeller && <span className="badge-new text-2xs" style={{ background: '#1C1A17' }}>Best</span>}
                        {product.isFeatured && <span className="text-2xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Featured</span>}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(product)} className="p-2 text-charcoal-500 hover:text-gold-500 hover:bg-gold-50 rounded-lg transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-charcoal-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-3xl shadow-hover w-full max-w-2xl max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200 sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="font-display text-2xl text-charcoal-900 font-light">
                {editing ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setModal(false)} className="p-2 hover:bg-cream-200 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Images */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-2">Product Images</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {images.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-200">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setImages(imgs => imgs.filter((_, j) => j !== i))} className="absolute inset-0 bg-charcoal-900/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <X size={14} className="text-white" />
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} className="w-16 h-16 rounded-xl border-2 border-dashed border-cream-300 flex items-center justify-center text-charcoal-400 hover:border-gold-400 hover:text-gold-500 transition-all">
                    {uploading ? <span className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /> : <Upload size={18} />}
                  </button>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Product Name *</label>
                  <input {...register('name')} className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Category *</label>
                  <select {...register('category')} className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body appearance-none">
                    {['necklaces', 'earrings', 'rings', 'bracelets'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Material *</label>
                  <input {...register('material')} defaultValue="316L Stainless Steel" className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Price (EGP) *</label>
                  <input {...register('price', { valueAsNumber: true })} type="number" className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                  {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price.message}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Compare Price (EGP)</label>
                  <input {...register('comparePrice', { valueAsNumber: true })} type="number" className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Discount %</label>
                  <input {...register('discount', { valueAsNumber: true })} type="number" min="0" max="100" className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Stock *</label>
                  <input {...register('stock', { valueAsNumber: true })} type="number" min="0" className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Short Description *</label>
                  <input {...register('shortDescription')} className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-charcoal-500 font-body mb-1.5">Full Description *</label>
                  <textarea {...register('description')} rows={3} className="w-full input-luxury rounded-xl px-4 py-2.5 text-sm font-body resize-none" />
                </div>
              </div>

              {/* Flags */}
              <div className="flex gap-4 flex-wrap">
                {(['isNew', 'isBestSeller', 'isFeatured'] as const).map(flag => (
                  <label key={flag} className="flex items-center gap-2 cursor-pointer select-none">
                    <input {...register(flag)} type="checkbox" className="sr-only peer" />
                    <div className="w-5 h-5 rounded border-2 border-cream-300 peer-checked:bg-gold-500 peer-checked:border-gold-500 flex items-center justify-center transition-all">
                      <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
                    </div>
                    <span className="text-sm text-charcoal-700 font-body capitalize">{flag.replace(/([A-Z])/g, ' $1').trim()}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-3 border border-cream-300 rounded-full text-sm font-body font-medium text-charcoal-600 hover:border-charcoal-400 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-gold py-3 rounded-full text-sm font-body font-medium flex items-center justify-center gap-2 disabled:opacity-70">
                  {saving && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {editing ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
