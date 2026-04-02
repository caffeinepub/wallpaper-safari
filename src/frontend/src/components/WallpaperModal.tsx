import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Download,
  HardDrive,
  Heart,
  MessageCircle,
  Tag,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Wallpaper } from "../backend";
import {
  useAddComment,
  useDownloadWallpaper,
  useLikeWallpaper,
} from "../hooks/useQueries";

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
}

function formatDate(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function WallpaperModal({
  wallpaper,
  onClose,
}: WallpaperModalProps) {
  const [author, setAuthor] = useState("");
  const [commentText, setCommentText] = useState("");

  const addComment = useAddComment();
  const likeWallpaper = useLikeWallpaper();
  const downloadWallpaper = useDownloadWallpaper();

  useEffect(() => {
    if (wallpaper) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [wallpaper]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!wallpaper) return null;

  const imageUrl = wallpaper.externalBlob.getDirectURL();

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !commentText.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await addComment.mutateAsync({
        id: wallpaper.id,
        author: author.trim(),
        text: commentText.trim(),
      });
      setAuthor("");
      setCommentText("");
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleLike = async () => {
    try {
      await likeWallpaper.mutateAsync(wallpaper.id);
    } catch {
      toast.error("Failed to like");
    }
  };

  const handleDownload = async () => {
    try {
      await downloadWallpaper.mutateAsync({
        id: wallpaper.id,
        url: imageUrl,
        title: wallpaper.title,
      });
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download");
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.95)", zIndex: 9999 }}
        data-ocid="wallpaper.modal.overlay"
      />

      {/* Modal container */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: 10000 }}
      >
        <div
          className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col md:flex-row"
          style={{ backgroundColor: "#0d0d0d" }}
          data-ocid="wallpaper.modal"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            aria-label="Close"
            data-ocid="wallpaper.modal.close_button"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Image side */}
          <div
            className="md:w-[55%] flex-shrink-0 flex items-center justify-center min-h-[200px]"
            style={{ backgroundColor: "#000" }}
          >
            <img
              src={imageUrl}
              alt={wallpaper.title}
              className="w-full h-full object-contain max-h-[40vh] md:max-h-[90vh]"
            />
          </div>

          {/* Info side */}
          <div
            className="flex-1 flex flex-col overflow-hidden"
            style={{ backgroundColor: "#0d0d0d" }}
          >
            <div className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2 pr-8">
                <h2 className="text-lg font-semibold leading-tight text-white">
                  {wallpaper.title}
                </h2>
                <Badge
                  variant="secondary"
                  className="flex-shrink-0 text-xs"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "#e5e5e5",
                  }}
                >
                  {wallpaper.category}
                </Badge>
              </div>
            </div>

            <div
              className="px-5 pb-3 flex flex-wrap gap-3 text-xs"
              style={{ color: "#aaa" }}
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(wallpaper.uploadedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {wallpaper.category}
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5" />
                3840 × 2160 · 4K
              </span>
            </div>

            <div className="px-5 pb-4 flex items-center gap-2">
              <Button
                onClick={handleDownload}
                disabled={downloadWallpaper.isPending}
                className="flex-1 h-9 text-sm font-medium rounded-xl"
                style={{ backgroundColor: "#fff", color: "#000" }}
                data-ocid="wallpaper.modal.download_button"
              >
                <Download className="w-4 h-4 mr-1.5" />
                {downloadWallpaper.isPending
                  ? "Downloading…"
                  : `Download (${wallpaper.downloads.toString()})`}
              </Button>

              <button
                type="button"
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 h-9 rounded-xl text-sm font-medium transition-colors"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#ccc",
                  backgroundColor: "transparent",
                }}
                data-ocid="wallpaper.modal.like_button"
              >
                <Heart className="w-4 h-4" />
                {wallpaper.likes.toString()}
              </button>
            </div>

            <Separator style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />

            <ScrollArea className="flex-1 px-5 py-4 min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4" style={{ color: "#888" }} />
                <span className="text-sm font-semibold text-white">
                  Comments ({wallpaper.comments.length})
                </span>
              </div>

              <AnimatePresence>
                {wallpaper.comments.length === 0 ? (
                  <p
                    className="text-xs py-2"
                    style={{ color: "#888" }}
                    data-ocid="wallpaper.comments.empty_state"
                  >
                    No comments yet. Be the first!
                  </p>
                ) : (
                  <div className="space-y-3 mb-4">
                    {wallpaper.comments.map((comment, i) => (
                      <motion.div
                        key={`${comment.author}-${comment.timestamp.toString()}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl p-3"
                        style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                        data-ocid={`wallpaper.comment.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-white">
                            {comment.author}
                          </span>
                          <span
                            className="text-[10px]"
                            style={{ color: "#666" }}
                          >
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#ccc" }}
                        >
                          {comment.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSubmitComment}
                className="space-y-2 pt-2"
                style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
              >
                <Input
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="h-8 text-sm text-white placeholder:text-gray-500"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  data-ocid="wallpaper.comment.author_input"
                />
                <Textarea
                  placeholder="Add a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="text-sm min-h-[60px] resize-none text-white placeholder:text-gray-500"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                  }}
                  data-ocid="wallpaper.comment.textarea"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={addComment.isPending}
                  className="w-full h-8 text-xs"
                  style={{ backgroundColor: "#fff", color: "#000" }}
                  data-ocid="wallpaper.comment.submit_button"
                >
                  {addComment.isPending ? "Posting…" : "Post Comment"}
                </Button>
                {addComment.isError && (
                  <p
                    className="text-xs text-red-400"
                    data-ocid="wallpaper.comment.error_state"
                  >
                    Failed to post comment. Try again.
                  </p>
                )}
              </form>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
