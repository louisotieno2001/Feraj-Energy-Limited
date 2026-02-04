# Product Image Management Guide

## Status Update (February 4, 2026)
- Roles now supported: admin, co_admin, employee, customer (installer replaced by employee).
- Staff access: admin/co_admin/employee can access /admin; user management limited to admin/co_admin.
- Co-admins cannot change admin/co_admin roles; they can manage employee/customer roles.
- Per-user permissions added: can_manage_products, can_manage_tickets, can_promote_to_co_admin (admin-only).
- Audit & monitoring: /admin/audit shows activity feed + ticket queue; profile sensitive edits, role/permission changes, and product CRUD are logged.
- Product images: URL or device upload, max 4 images, 2MB per image, primary image = first.
- Environment files (.env, .env.local, etc.) must never be committed; use host env vars.
- Linting: Prettier applied; ESLint passes with warnings only (mostly any/fast-refresh).

**Last Updated**: January 23, 2026  
**Version**: v1.3.0

---

## Overview

Admins/co-admins (and employees with product permission) can add multiple images to products through the admin panel. The current implementation supports **URL-based images** and **device uploads**. Device uploads are stored as data URLs in the database for quick setup (no external hosting required).

---

## How to Add Product Images

### Method 1: When Creating a New Product

1. **Navigate to Admin Products**
   - Log in as admin
   - Go to `/admin/products`
   - Click **"Add Product"** button

2. **Fill Product Details**
   - Enter product name, description, category, price, stock quantity
   - Add specifications (optional)

3. **Add Images (URL or Upload)**
   - Scroll to the **"Images"** section
   - Paste an image URL in the text field
   - Example: `https://example.com/images/solar-panel-550w.jpg`
   - Click the **+ (Plus)** button to add the image
   - **Live preview** appears showing the image
   - Or click **"Upload from device"** to pick image files (JPG/PNG/WebP)
   - Repeat to add multiple images (recommended: 3-5 images per product)

4. **Manage Images**
   - Hover over any image preview
   - Click the **trash icon** to remove an image
   - Click **"Set primary"** to move an image to the first position
   - First image becomes the primary product thumbnail

5. **Save Product**
   - Click **"Create Product"** button
   - Product appears immediately on the site with images

### Method 2: When Editing Existing Products

1. **Find the Product**
   - Go to `/admin/products`
   - Use search or filters to find the product
   - Click the **edit icon** (pencil)

2. **Modify Images**
   - Existing images are displayed with previews
   - Add new images using the same process as above
   - Remove unwanted images by clicking the trash icon
   - Reorder is not available (first image = primary)

3. **Save Changes**
   - Click **"Update Product"** button
   - Changes appear immediately on the site

---

## Image Requirements

### URL Format
- ✅ Must be a valid URL (https:// or http://)
- ✅ Must be publicly accessible (not behind authentication)
- ✅ Direct link to image file (ends in .jpg, .png, .webp, etc.)
- ❌ Not a webpage containing the image

### Valid Examples
```
✅ https://i.imgur.com/abc123.jpg
✅ https://example.com/products/solar-panel.png
✅ https://cdn.shopify.com/files/panel-550w.webp
✅ https://drive.google.com/uc?id=FILE_ID (Google Drive direct link)
```

### Invalid Examples
```
❌ https://imgur.com/abc123 (webpage, not direct image)
❌ /images/panel.jpg (relative path, not full URL)
❌ C:\Users\Desktop\image.jpg (local file path)
❌ https://private-site.com/image.jpg (requires login)
```

### Image Specifications
- **Format**: JPG, PNG, WebP, GIF
- **Recommended size**: 800x800px to 1200x1200px
- **File size**: Under 2 MB per image (enforced for device uploads)
- **Aspect ratio**: Square (1:1) or landscape (4:3) preferred
- **Minimum**: 1 image required per product
- **Maximum**: 4 images per product (enforced)

---

## Where to Host Images

If you use URLs, images must be hosted externally. Device uploads are stored directly in the database as data URLs for fast setup. For larger catalogs, external hosting is recommended to keep database rows small.

### Option 1: Imgur (Free, Easy)
**Best for**: Quick uploads, testing

1. Go to [imgur.com](https://imgur.com)
2. Click "New Post" → Upload image
3. After upload, right-click image → "Copy image address"
4. Use this URL in the product form

**Pros**: Free, no account needed, fast  
**Cons**: Images may be public, no organization

### Option 2: Google Drive (Free)
**Best for**: Organized storage, team access

1. Upload image to Google Drive
2. Right-click → "Get link" → "Anyone with the link"
3. Copy the file ID from the URL
4. Use: `https://drive.google.com/uc?id=FILE_ID`

**Pros**: Free, organized, team sharing  
**Cons**: Requires Google account, extra steps

### Option 3: Cloudinary (Free tier)
**Best for**: Professional use, optimization

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Upload images via dashboard
3. Copy the "Secure URL"
4. Use this URL in the product form

**Pros**: Free tier, auto-optimization, transformations  
**Cons**: Requires account, learning curve

### Option 4: Your Own Website/CDN
**Best for**: Full control, branding

1. Upload images to your web hosting
2. Ensure images are in public directory
3. Use full URL: `https://yoursite.com/products/image.jpg`

**Pros**: Full control, custom domain  
**Cons**: Requires hosting, bandwidth costs

---

## Best Practices

### Image Organization
```
Recommended naming convention:
- product-name-angle-size.jpg
  
Examples:
- solar-panel-550w-front-view.jpg
- solar-panel-550w-side-view.jpg
- solar-panel-550w-installation.jpg
- inverter-5kw-display.jpg
```

### Multiple Images Strategy
1. **First image**: Product on white background (catalog shot)
2. **Second image**: Product in use/installation
3. **Third image**: Close-up of key features
4. **Fourth image**: Size/dimension reference
5. **Fifth image**: Packaging/what's included

### Image Quality Tips
- ✅ Use good lighting (natural light or studio setup)
- ✅ Plain background (white or neutral)
- ✅ High resolution (minimum 800px width)
- ✅ Show product from multiple angles
- ✅ Include scale reference if size matters
- ❌ Avoid blurry or pixelated images
- ❌ Avoid watermarks that obscure product
- ❌ Avoid overly edited/filtered images

---

## Troubleshooting

### Image Not Displaying
**Problem**: Broken image icon appears

**Solutions**:
1. **Check URL validity**
   - Open URL in new browser tab
   - Confirm image loads directly
   
2. **Check URL accessibility**
   - Ensure image is publicly accessible
   - Not behind login/authentication
   
3. **Check URL format**
   - Must be direct image link
   - Should end in .jpg, .png, .webp, etc.

4. **CORS issues** (rare)
   - Some hosts block external embedding
   - Use a different host or enable CORS

### Invalid URL Error
**Problem**: Form shows "Invalid URL format"

**Solutions**:
- Ensure URL starts with `https://` or `http://`
- Check for typos in the URL
- Remove any extra characters or spaces

### Image Loads Slowly
**Problem**: Images take long to appear

**Solutions**:
1. **Optimize image file size**
   - Use tools like TinyPNG.com to compress
   - Target under 200 KB per image
   
2. **Use a CDN**
   - Cloudinary, Imgur have built-in CDNs
   - Faster global delivery

3. **Reduce image dimensions**
   - Resize to 1000px width maximum
   - No need for 4K images on web

### Wrong Image Displays
**Problem**: Different image shows than expected

**Solutions**:
- Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
- Verify URL in product form is correct
- Check if URL redirects to different image

---

## Migration to File Upload (Future)

### Planned Enhancement: Supabase Storage Integration

Currently in planning for v1.4.0:

**Features**:
- ✅ Direct file upload (drag-and-drop)
- ✅ Automatic URL generation
- ✅ Built-in CDN for fast delivery
- ✅ Image cropping/resizing in browser
- ✅ Organized in Supabase Storage buckets
- ✅ Automatic cleanup when product deleted

**Timeline**: 2-3 hours of development  
**Priority**: Medium (current URL method works)

**Advantages**:
- No external service needed
- Better user experience
- Consistent storage
- Automatic optimization

**Process** (when implemented):
1. Click "Upload Image" button
2. Select file from computer or drag-and-drop
3. Image automatically uploads to Supabase
4. URL generated and saved with product
5. Image served from Supabase CDN

---

## Examples

### Example 1: Adding Solar Panel Product

```
Product: 550W Monocrystalline Solar Panel

Images to add (in order):
1. https://example.com/panels/550w-front.jpg (primary)
2. https://example.com/panels/550w-back.jpg
3. https://example.com/panels/550w-installed.jpg
4. https://example.com/panels/550w-specs.jpg

Result: 
- First image shows in product grid
- All 4 images appear in product detail page
- Customers can view multiple angles
```

### Example 2: Adding Inverter Product

```
Product: 5kW Hybrid Inverter

Images to add (in order):
1. https://example.com/inverters/5kw-front.jpg
2. https://example.com/inverters/5kw-display.jpg
3. https://example.com/inverters/5kw-connections.jpg
4. https://example.com/inverters/5kw-dimensions.jpg
5. https://example.com/inverters/5kw-installation.jpg

Result:
- Comprehensive visual documentation
- Customers understand product fully
- Reduces support questions
```

---

## Quick Reference

### Add Image Checklist
- [ ] Image is high quality (800px+ width)
- [ ] Image is hosted publicly (Imgur, Drive, CDN)
- [ ] URL is direct link to image file
- [ ] URL tested in browser (opens image directly)
- [ ] At least 1 image added (3-5 recommended)
- [ ] First image is best product shot (becomes thumbnail)
- [ ] Product saved successfully

### Common Actions
| Action | Steps |
|--------|-------|
| Add new image | Paste URL → Click + button |
| Remove image | Hover → Click trash icon |
| Preview image | URL automatically shows preview |
| Set primary | First image = primary (reorder by delete/re-add) |
| Update images | Edit product → Modify images → Save |

---

## Support

### Need Help?
- Check URL in browser first
- Verify image is publicly accessible
- Try different image hosting service
- Contact admin if persistent issues

### Report Issues
If you encounter problems with image management:
1. Note the exact error message
2. Check browser console (F12 → Console tab)
3. Verify image URL works in incognito mode
4. Document steps to reproduce

---

**Current Version**: URL-based image management  
**Future Version**: Direct file upload with Supabase Storage  
**Status**: Fully functional, ready for production use
