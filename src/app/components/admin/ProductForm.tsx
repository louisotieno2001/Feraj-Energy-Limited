import { useEffect, useState } from 'react';
import { Plus, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/services/products.service';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
}

export interface ProductFormData {
  name: string;
  description: string;
  category: 'panels' | 'inverters' | 'batteries' | 'accessories';
  price: number;
  stock_quantity: number;
  specifications: Record<string, any>;
  images: string[];
  is_active: boolean;
}

export function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const maxImages = 4;
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: 'panels',
    price: 0,
    stock_quantity: 0,
    specifications: {},
    images: [],
    is_active: true,
  });

  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category as ProductFormData['category'],
        price: product.price,
        stock_quantity: product.stock_quantity,
        specifications: product.specifications || {},
        images: product.images || [],
        is_active: product.is_active,
      });
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (formData.stock_quantity < 0) {
      toast.error('Stock quantity cannot be negative');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(`Failed to ${product ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  const addSpecification = () => {
    if (!specKey.trim() || !specValue.trim()) {
      toast.error('Both key and value are required');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [specKey]: specValue,
      },
    }));

    setSpecKey('');
    setSpecValue('');
  };

  const removeSpecification = (key: string) => {
    setFormData((prev) => {
      const nextSpecifications = { ...prev.specifications };
      delete nextSpecifications[key];
      return {
        ...prev,
        specifications: nextSpecifications,
      };
    });
  };

  const addImage = () => {
    if (!imageUrl.trim()) {
      toast.error('Image URL is required');
      return;
    }

    if (formData.images.length >= maxImages) {
      toast.error(`You can upload up to ${maxImages} images`);
      return;
    }

    try {
      new URL(imageUrl);
    } catch {
      toast.error('Invalid URL format');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrl],
    }));
    setImageUrl('');
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxSizeBytes = 2 * 1024 * 1024;
    const fileArray = Array.from(files);
    const remainingSlots = Math.max(0, maxImages - formData.images.length);

    if (remainingSlots === 0) {
      toast.error(`You can upload up to ${maxImages} images`);
      return;
    }

    const limitedFiles = fileArray.slice(0, remainingSlots);
    if (fileArray.length > remainingSlots) {
      toast.error(`Only ${remainingSlots} more image(s) can be added`);
    }

    const readFile = (file: File) =>
      new Promise<string>((resolve, reject) => {
        if (!file.type.startsWith('image/')) {
          reject(new Error('Only image files are allowed'));
          return;
        }

        if (file.size > maxSizeBytes) {
          reject(new Error('Image must be 2MB or smaller'));
          return;
        }

        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
      });

    try {
      const images = await Promise.all(limitedFiles.map(readFile));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev) => {
      const nextImages = [...prev.images];
      const [selected] = nextImages.splice(index, 1);
      return {
        ...prev,
        images: [selected, ...nextImages],
      };
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, currentIndex) => currentIndex !== index),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div className="my-8 w-full max-w-3xl rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(12,14,20,0.98),rgba(8,10,15,0.96))] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
        <div className="flex items-center justify-between border-b border-white/8 p-6">
          <h2 className="text-xl font-semibold text-white/92">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-white/50 transition hover:text-white/90"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/72">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 placeholder:text-white/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              placeholder="e.g., 550W Solar Panel"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/72">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 placeholder:text-white/38 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              placeholder="Detailed product description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/72">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as ProductFormData['category'],
                  }))
                }
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              >
                <option value="panels">Solar Panels</option>
                <option value="inverters">Inverters</option>
                <option value="batteries">Batteries</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/72">
                Price (KES) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(e.target.value) || 0,
                  }))
                }
                min="0"
                step="0.01"
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/72">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock_quantity: parseInt(e.target.value, 10) || 0,
                  }))
                }
                min="0"
                className="w-full rounded-md border border-white/10 bg-white/5 px-4 py-2 text-white/86 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
                placeholder="0"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/72">
                Status
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-white/10 bg-white/5 px-4 py-2">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-white/20 text-primary focus:ring-primary"
                />
                <span className="text-sm text-white/78">
                  Active (visible to customers)
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/72">
              Specifications
            </label>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Key (e.g., Wattage)"
                className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/86 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              />
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Value (e.g., 550W)"
                className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/86 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {Object.keys(formData.specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between rounded-md border border-white/8 bg-white/5 px-3 py-2"
                  >
                    <span className="text-sm text-white/78">
                      <span className="font-medium text-white/90">{key}:</span>{' '}
                      {String(value)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-300 transition hover:text-red-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/72">
              Images * (URL or Upload)
            </label>
            <div className="mb-3 flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/86 focus:border-primary/40 focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded-md bg-primary px-4 py-2 text-white transition hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm text-white/78">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 hover:bg-white/6">
                <Upload className="h-4 w-4" />
                Upload from device
              </span>
              <span className="text-xs text-white/48">Max 2MB per image</span>
            </label>

            <p className="mb-3 text-xs text-white/48">
              {formData.images.length}/{maxImages} images added. First image is
              used as the primary thumbnail.
            </p>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {formData.images.map((img, index) => (
                  <div
                    key={`${img}-${index}`}
                    className="group relative overflow-hidden rounded-md border border-white/10"
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="h-32 w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.src =
                          'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                    {index === 0 ? (
                      <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-1 text-xs text-white">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs text-slate-900 opacity-0 transition group-hover:opacity-100"
                      >
                        Set primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute right-2 top-2 rounded-md bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 border-t border-white/8 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-md border border-white/10 bg-white/6 px-4 py-2 text-white/80 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-md bg-primary px-4 py-2 text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : product
                  ? 'Update Product'
                  : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
