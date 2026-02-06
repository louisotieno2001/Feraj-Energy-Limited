import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';
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

  // Specification fields
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  // Image field
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category: product.category as
          | 'panels'
          | 'inverters'
          | 'batteries'
          | 'accessories',
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

    // Validation
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
    } catch (error: any) {
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
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
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

    // Basic URL validation
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
      const dataUrls = await Promise.all(limitedFiles.map(readFile));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...dataUrls],
      }));
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    }
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev) => {
      const nextImages = [...prev.images];
      const [selected] = nextImages.splice(index, 1);
      return { ...prev, images: [selected, ...nextImages] };
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-foreground">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-muted-foreground transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., 550W Solar Panel"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
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
              className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="panels">Solar Panels</option>
                <option value="inverters">Inverters</option>
                <option value="batteries">Batteries</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
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
                className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Stock & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    stock_quantity: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                className="w-full px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                Status
              </label>
              <label className="flex items-center gap-3 px-4 py-2 border border-border rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_active: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="text-sm text-foreground/80">
                  Active (visible to customers)
                </span>
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Specifications
            </label>

            {/* Add specification */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={specKey}
                onChange={(e) => setSpecKey(e.target.value)}
                placeholder="Key (e.g., Wattage)"
                className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <input
                type="text"
                value={specValue}
                onChange={(e) => setSpecValue(e.target.value)}
                placeholder="Value (e.g., 550W)"
                className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={addSpecification}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Specifications list */}
            {Object.keys(formData.specifications).length > 0 && (
              <div className="space-y-2">
                {Object.entries(formData.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-3 py-2 bg-secondary/60 rounded-md"
                  >
                    <span className="text-sm">
                      <span className="font-medium">{key}:</span>{' '}
                      {String(value)}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSpecification(key)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-2">
              Images * (URL or Upload)
            </label>

            {/* Add image */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Upload images */}
            <label className="flex items-center gap-3 mb-3 text-sm text-foreground/80 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 px-3 py-2 border border-border rounded-md hover:bg-secondary/70">
                <Upload className="h-4 w-4" />
                Upload from device
              </span>
              <span className="text-xs text-muted-foreground">
                Max 2MB per image
              </span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              {formData.images.length}/{maxImages} images added. First image is
              used as the primary thumbnail.
            </p>

            {/* Images list */}
            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="relative group border border-border rounded-md overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                    {index === 0 ? (
                      <span className="absolute bottom-2 left-2 text-xs bg-primary text-white px-2 py-1 rounded">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setPrimaryImage(index)}
                        className="absolute bottom-2 left-2 text-xs bg-white/90 text-foreground/80 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                      >
                        Set primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 rounded-md btn-secondary disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
