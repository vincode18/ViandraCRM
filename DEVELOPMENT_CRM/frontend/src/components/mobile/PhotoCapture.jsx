import { useRef, useState } from 'react';
import { Camera, Trash2, Image } from 'lucide-react';
import { saveOfflinePhoto } from '../../services/offlineStorageService';

const MAX_PHOTOS = 10;
const MAX_LONG_EDGE = 1920;
const JPEG_QUALITY = 0.8;

function generateId() {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const { width, height } = img;
        const longEdge = Math.max(width, height);
        const scale = longEdge > MAX_LONG_EDGE ? MAX_LONG_EDGE / longEdge : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale);
        canvas.height = Math.round(height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', JPEG_QUALITY);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * PhotoCapture — camera/file picker with client-side compression + IndexedDB storage.
 *
 * Props:
 *   submissionId: string  — parent submission ID for IndexedDB linkage
 *   onPhotosChange: (photos: PhotoMeta[]) => void
 */
export default function PhotoCapture({ submissionId, onPhotosChange }) {
  const inputRef = useRef(null);
  const [photos, setPhotos] = useState([]); // [{ id, url, blob, size }]
  const [uploading, setUploading] = useState(false);

  const totalBytes = photos.reduce((s, p) => s + p.size, 0);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (photos.length + files.length > MAX_PHOTOS) {
      alert(`Maximum ${MAX_PHOTOS} photos per form.`);
      return;
    }

    setUploading(true);
    const newPhotos = [];

    for (const file of files) {
      try {
        const blob = await compressImage(file);
        const url = URL.createObjectURL(blob);
        const id = generateId();

        if (submissionId) {
          await saveOfflinePhoto({
            id,
            submission_id: submissionId,
            blob,
            filename: file.name,
            mime_type: 'image/jpeg',
            size_bytes: blob.size,
            captured_at: new Date().toISOString(),
            upload_status: 'pending',
          });
        }

        newPhotos.push({ id, url, blob, size: blob.size });
      } catch (err) {
        console.error('[PhotoCapture] Failed to process photo:', err);
      }
    }

    // Reset input so same file can be selected again
    e.target.value = '';

    setPhotos(prev => {
      const updated = [...prev, ...newPhotos];
      onPhotosChange?.(updated);
      return updated;
    });
    setUploading(false);
  };

  const removePhoto = (id) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.url);
      const updated = prev.filter(p => p.id !== id);
      onPhotosChange?.(updated);
      return updated;
    });
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        aria-label="Select photos"
      />

      {/* Add photo button */}
      {photos.length < MAX_PHOTOS && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, minHeight: 44 }}
        >
          <Camera size={16} />
          {uploading ? 'Processing…' : photos.length === 0 ? 'Add Photo' : 'Add More Photos'}
        </button>
      )}

      {/* Thumbnail grid */}
      {photos.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
          {photos.map(photo => (
            <div key={photo.id} style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', aspectRatio: '1' }}>
              <img
                src={photo.url}
                alt="Captured photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label="Remove photo"
                style={{
                  position: 'absolute', top: 4, right: 4,
                  background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4,
                  padding: 4, cursor: 'pointer', display: 'flex',
                }}
              >
                <Trash2 size={12} style={{ color: '#fff' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Size indicator */}
      {photos.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Image size={12} />
          {photos.length} photo{photos.length !== 1 ? 's' : ''} — {formatBytes(totalBytes)}
          {photos.length >= MAX_PHOTOS && <span style={{ color: 'var(--color-warning)', marginLeft: 4 }}>(max reached)</span>}
        </div>
      )}
    </div>
  );
}
