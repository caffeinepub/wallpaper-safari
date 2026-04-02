import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useState } from "react";
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
      await downloadWallpaper.mutateAsync({ id: wallpaper.id, url: imageUrl });
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download");
    }
  };

  return (
    <Dialog open={!!wallpaper} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-3xl w-[95vw] p-0 overflow-hidden rounded-2xl bg-background"
        data-ocid="wallpaper.modal"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 z-50 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
          data-ocid="wallpaper.modal.close_button"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh]">
          <div className="md:w-[55%] bg-black flex-shrink-0 flex items-center justify-center">
            <img
              src={imageUrl}
              alt={wallpaper.title}
              className="w-full h-full object-contain max-h-[40vh] md:max-h-[90vh]"
            />
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            <DialogHeader className="p-5 pb-3">
              <div className="flex items-start justify-between gap-2">
                <DialogTitle className="text-lg font-semibold text-foreground leading-tight">
                  {wallpaper.title}
                </DialogTitle>
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  {wallpaper.category}
                </Badge>
              </div>
            </DialogHeader>

            <div className="px-5 pb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
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
                className="flex-1 h-9 text-sm font-medium bg-foreground text-primary-foreground hover:opacity-90 rounded-xl"
                data-ocid="wallpaper.modal.download_button"
              >
                <Download className="w-4 h-4 mr-1.5" />
                {downloadWallpaper.isPending
                  ? "Opening…"
                  : `Download (${wallpaper.downloads.toString()})`}
              </Button>

              <button
                type="button"
                onClick={handleLike}
                className="flex items-center gap-1.5 px-3 h-9 rounded-xl border border-border hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors text-sm font-medium"
                data-ocid="wallpaper.modal.like_button"
              >
                <Heart className="w-4 h-4" />
                {wallpaper.likes.toString()}
              </button>
            </div>

            <Separator />

            <ScrollArea className="flex-1 px-5 py-4 min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  Comments ({wallpaper.comments.length})
                </span>
              </div>

              <AnimatePresence>
                {wallpaper.comments.length === 0 ? (
                  <p
                    className="text-xs text-muted-foreground py-2"
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
                        className="bg-muted rounded-xl p-3"
                        data-ocid={`wallpaper.comment.item.${i + 1}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-foreground">
                            {comment.author}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatDate(comment.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-foreground/80 leading-relaxed">
                          {comment.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSubmitComment}
                className="space-y-2 pt-2 border-t border-border"
              >
                <Input
                  placeholder="Your name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="h-8 text-sm"
                  data-ocid="wallpaper.comment.author_input"
                />
                <Textarea
                  placeholder="Add a comment…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="text-sm min-h-[60px] resize-none"
                  data-ocid="wallpaper.comment.textarea"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={addComment.isPending}
                  className="w-full h-8 text-xs bg-foreground text-primary-foreground hover:opacity-90"
                  data-ocid="wallpaper.comment.submit_button"
                >
                  {addComment.isPending ? "Posting…" : "Post Comment"}
                </Button>
                {addComment.isError && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="wallpaper.comment.error_state"
                  >
                    Failed to post comment. Try again.
                  </p>
                )}
              </form>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
