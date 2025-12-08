'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { useActivityTracker } from '@/hooks/useActivityTracker';

export default function NewListingPage() {
  const router = useRouter();
  useActivityTracker(); // 3 dakika inactivity tracking
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: { tr: '', en: '', ar: '' },
    description: { tr: '', en: '', ar: '' },
    price: '',
    currency: 'TRY',
    status: 'inactive',
    location: '',
    latitude: '',
    longitude: '',
    netArea: '',
    grossArea: '',
    roomCount: '',
    virtualTourUrl: '',
    videoUrl: '',
    assignedAgentId: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/onglgyrmnkl-admin');
      return;
    }

    // Fetch users for agent assignment
    api.get('/users')
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error('Error fetching users:', err));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const listingData = {
        ...formData,
        price: parseFloat(formData.price),
        netArea: parseFloat(formData.netArea),
        grossArea: formData.grossArea ? parseFloat(formData.grossArea) : undefined,
        roomCount: formData.roomCount, // Now a string (e.g., "1+1", "2+1")
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        virtualTourUrl: formData.virtualTourUrl?.trim() || null,
        videoUrl: formData.videoUrl?.trim() || null,
        assignedAgentId: formData.assignedAgentId || users[0]?.id,
      };

      const response = await api.post('/listings', listingData);
      const listingId = response.data.id;

      // Upload images if provided
      if (imageFiles.length > 0) {
        const formDataImages = new FormData();
        imageFiles.forEach((file) => {
          formDataImages.append('images', file);
        });

        try {
          const imageResponse = await api.post(`/listings/${listingId}/images`, formDataImages, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          console.log('Images uploaded successfully:', imageResponse.data);
        } catch (imageError: any) {
          console.error('Error uploading images:', imageError);
          console.error('Error details:', imageError.response?.data);
          alert('Fotoğraflar yüklenirken bir hata oluştu: ' + (imageError.response?.data?.message || imageError.message));
          // Continue even if image upload fails
        }
      }

      router.push(`/onglgyrmnkl-admin/dashboard/listings/${listingId}`);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      alert(error.response?.data?.message || 'İlan oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);
      
      // Create previews for new files
      const newPreviews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result as string);
          if (newPreviews.length === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 bg-luxury-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-luxury text-4xl font-serif text-luxury-black">
              Yeni İlan Ekle
            </h1>
            <a
              href="/onglgyrmnkl-admin/dashboard/listings"
              className="text-luxury-medium-gray hover:text-luxury-black"
            >
              ← Geri
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Multilingual Title */}
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-4 text-luxury-black">Başlık</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">Türkçe</label>
                  <input
                    type="text"
                    value={formData.title.tr}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, tr: e.target.value } })}
                    required
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">English</label>
                  <input
                    type="text"
                    value={formData.title.en}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, en: e.target.value } })}
                    required
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">العربية</label>
                  <input
                    type="text"
                    value={formData.title.ar}
                    onChange={(e) => setFormData({ ...formData, title: { ...formData.title, ar: e.target.value } })}
                    required
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
              </div>
            </div>

            {/* Multilingual Description */}
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-4 text-luxury-black">Açıklama</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">Türkçe</label>
                  <textarea
                    value={formData.description.tr}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, tr: e.target.value } })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">English</label>
                  <textarea
                    value={formData.description.en}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, en: e.target.value } })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">العربية</label>
                  <textarea
                    value={formData.description.ar}
                    onChange={(e) => setFormData({ ...formData, description: { ...formData.description, ar: e.target.value } })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Fiyat</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Para Birimi</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                >
                  <option value="TRY">TRY</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Durum</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                >
                  <option value="inactive">Pasif</option>
                  <option value="active_for_sale">Satılık</option>
                  <option value="active_for_rent">Kiralık</option>
                  <option value="sold">Satıldı</option>
                  <option value="rented">Kiraya Verildi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Atanan Danışman</label>
                <select
                  value={formData.assignedAgentId}
                  onChange={(e) => setFormData({ ...formData, assignedAgentId: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                >
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-4 text-luxury-black">Konum</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">Adres</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-luxury-black mb-2">Enlem (Latitude)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                      className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luxury-black mb-2">Boylam (Longitude)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                      className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Net Alan (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.netArea}
                  onChange={(e) => setFormData({ ...formData, netArea: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Brüt Alan (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.grossArea}
                  onChange={(e) => setFormData({ ...formData, grossArea: e.target.value })}
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-luxury-black mb-2">Oda Sayısı (örn: 1+1, 2+1, 3+1)</label>
                <input
                  type="text"
                  value={formData.roomCount}
                  onChange={(e) => setFormData({ ...formData, roomCount: e.target.value })}
                  placeholder="1+1"
                  required
                  className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                />
              </div>
            </div>

            {/* Media URLs */}
            <div className="border border-luxury-silver p-6">
              <h2 className="text-xl font-medium mb-4 text-luxury-black">Medya</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">360° Sanal Tur URL (Opsiyonel)</label>
                  <input
                    type="url"
                    value={formData.virtualTourUrl}
                    onChange={(e) => setFormData({ ...formData, virtualTourUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">Video URL (Opsiyonel)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luxury-black mb-2">Fotoğraflar</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-luxury-silver focus:outline-none focus:border-luxury-black mb-4"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover border border-luxury-silver"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs hover:bg-red-700"
                          >
                            Sil
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-luxury-black text-luxury-white hover:bg-luxury-dark-gray transition-colors disabled:opacity-50"
              >
                {loading ? 'Kaydediliyor...' : 'İlan Oluştur'}
              </button>
              <a
                href="/onglgyrmnkl-admin/dashboard/listings"
                className="px-8 py-3 border border-luxury-black text-luxury-black hover:bg-luxury-light-gray transition-colors"
              >
                İptal
              </a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

