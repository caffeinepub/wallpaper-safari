import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ImageIcon, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import { useAddWallpaper } from "../hooks/useQueries";

const PRESET_CATEGORIES = [
  "Nature",
  "Abstract",
  "Architecture",
  "Space",
  "Animals",
  "Minimal",
  "Cars",
  "Dark",
  "Anime",
  "City",
  "Ocean",
  "Other",
];

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function UploadModal({ open, onClose }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addWallpaper = useAddWallpaper();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (!dropped) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(dropped);
    setPreviewUrl(URL.createObjectURL(dropped));
  };

  const handleRemoveImage = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const reset = () => {
    setTitle("");
    setCategory("");
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!category.trim()) {
      toast.error("Please enter a category");
      return;
    }
    if (!file) {
      toast.error("Please select an image");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });
      const id = crypto.randomUUID();
      await addWallpaper.mutateAsync({
        id,
        title: title.trim(),
        category: category.trim(),
        blob,
      });
      toast.success("Wallpaper uploaded successfully!");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.92)",
        zIndex: 9999,
      }}
      data-ocid="upload.modal.overlay"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-background p-6 shadow-2xl"
        style={{ zIndex: 10000 }}
        data-ocid="upload.modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-semibold text-[17px] text-foreground">
              Upload Wallpaper
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add a new wallpaper to the gallery
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drop zone */}
          <button
            type="button"
            className="relative w-full border-2 border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:border-foreground/40 transition-colors text-left"
            style={{ minHeight: "140px" }}
            onClick={openFilePicker}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            data-ocid="upload.dropzone"
          >
            {previewUrl ? (
              <>
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-36 object-cover"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}
                  data-ocid="upload.remove_image.button"
                >
                  <X className="w-3 h-3" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                <ImageIcon className="w-8 h-8" />
                <p className="text-sm font-medium">
                  Drop image here or click to browse
                </p>
                <p className="text-xs">PNG, JPG, WEBP up to 20MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              data-ocid="upload.file_input"
            />
          </button>

          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="upload-title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="upload-title"
              placeholder="e.g. Misty Mountain Peaks"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9"
              data-ocid="upload.title_input"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label htmlFor="upload-category" className="text-sm font-medium">
              Category
            </Label>
            <Input
              id="upload-category"
              placeholder="e.g. Nature"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              list="category-suggestions"
              className="h-9"
              data-ocid="upload.category_input"
            />
            <datalist id="category-suggestions">
              {PRESET_CATEGORIES.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {PRESET_CATEGORIES.slice(0, 8).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                    category === c
                      ? "bg-foreground text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted-foreground/20"
                  }`}
                  data-ocid="upload.category.toggle"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {isUploading && (
            <div className="space-y-1.5" data-ocid="upload.loading_state">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading…</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1.5" />
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
              disabled={isUploading}
              data-ocid="upload.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-foreground text-primary-foreground hover:opacity-90"
              disabled={isUploading}
              data-ocid="upload.submit_button"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Uploading…
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1.5" /> Upload
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
