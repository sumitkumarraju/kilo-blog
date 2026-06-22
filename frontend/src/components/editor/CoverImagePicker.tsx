import { useRef, useState } from 'react';
import { ImagePlus, Upload, Link2, X, AlertCircle, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface Props {
  value?: string | null;
  onChange: (url: string) => void;
}

type Mode = 'url' | 'upload';

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1600;

export function CoverImagePicker({ value, onChange }: Props) {
  const [mode, setMode] = useState<Mode>('url');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('That file is not an image.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('Image is larger than 5 MB. Try resizing before uploading.');
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await resizeToDataUrl(file, MAX_DIMENSION);
      onChange(dataUrl);
    } catch {
      setError('Could not read that image.');
    } finally {
      setBusy(false);
    }
  }

  function onPick() {
    fileRef.current?.click();
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          if (mode !== 'upload') return;
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          if (mode !== 'upload') return;
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={`relative aspect-[16/9] overflow-hidden rounded-xl border bg-surface-2 transition-colors duration-200 ${
          dragOver ? 'border-accent' : 'border-line'
        }`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="size-full object-cover" />
            <button
              type="button"
              onClick={() => {
                setError(null);
                onChange('');
              }}
              aria-label="Remove cover"
              className="absolute right-2 top-2 inline-flex size-7 cursor-pointer items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm transition-colors duration-160 hover:bg-paper"
            >
              <X className="size-3.5" strokeWidth={1.75} />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={mode === 'upload' ? onPick : undefined}
            className={`flex h-full w-full flex-col items-center justify-center gap-2 text-muted ${
              mode === 'upload' ? 'cursor-pointer hover:text-ink' : ''
            }`}
          >
            {busy ? (
              <Loader2 className="size-6 animate-spin" strokeWidth={1.5} />
            ) : (
              <ImagePlus className="size-6" strokeWidth={1.5} />
            )}
            <span className="text-xs">
              {mode === 'upload'
                ? dragOver
                  ? 'Drop to upload'
                  : 'Click or drop an image'
                : 'No cover image yet'}
            </span>
          </button>
        )}
      </div>

      <div className="inline-flex w-full rounded-full border border-line p-0.5 text-xs">
        <ModeButton
          active={mode === 'url'}
          onClick={() => {
            setMode('url');
            setError(null);
          }}
          icon={<Link2 className="size-3.5" strokeWidth={1.75} />}
          label="Paste URL"
        />
        <ModeButton
          active={mode === 'upload'}
          onClick={() => {
            setMode('upload');
            setError(null);
          }}
          icon={<Upload className="size-3.5" strokeWidth={1.75} />}
          label="Upload"
        />
      </div>

      {mode === 'url' ? (
        <Input
          label="Cover image URL"
          placeholder="https://images.example.com/cover.jpg"
          value={value && value.startsWith('data:') ? '' : value ?? ''}
          onChange={(e) => {
            setError(null);
            onChange(e.target.value);
          }}
        />
      ) : (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={onPick}
            disabled={busy}
            className="inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line text-sm text-ink transition-colors duration-160 hover:border-ink disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={1.75} /> Processing…
              </>
            ) : (
              <>
                <Upload className="size-4" strokeWidth={1.75} /> Choose from device
              </>
            )}
          </button>
          <p className="text-[11px] text-muted">
            PNG, JPG, WebP up to 5 MB. Resized to 1600 px on the long edge.
          </p>
        </>
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-xs text-accent">
          <AlertCircle className="size-3.5 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      )}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-7 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full transition-colors duration-160 ${
        active ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function resizeToDataUrl(file: File, maxDim: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode failed'));
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('canvas unavailable'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const out = canvas.toDataURL(
          file.type === 'image/png' ? 'image/png' : 'image/jpeg',
          0.86,
        );
        resolve(out);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
