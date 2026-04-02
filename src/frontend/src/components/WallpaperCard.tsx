import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Heart, MessageCircle, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import type { Wallpaper } from "../backend";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  isAdmin: boolean;
  onLike: (id: string) => void;
  onDownload: (id: string, url: string) => void;
  onDelete: (id: string) => void;
  onClick: (wallpaper: Wallpaper) => void;
  index: number;
}

export default function WallpaperCard({
  wallpaper,
  isAdmin,
  onLike,
  onDownload,
  onDelete,
  onClick,
  index,
}: WallpaperCardProps) {
  const imageUrl = wallpaper.externalBlob.getDirectURL();
  const ocidIndex = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.3) }}
      className="wallpaper-card masonry-item bg-card border border-border rounded-xl overflow-hidden shadow-card cursor-pointer"
      data-ocid={`wallpaper.item.${ocidIndex}`}
      onClick={() => onClick(wallpaper)}
    >
      <div className="relative overflow-hidden bg-muted">
        <img
          src={imageUrl}
          alt={wallpaper.title}
          className="w-full object-cover block transition-transform duration-300 hover:scale-105"
          style={{
            aspectRatio: "auto",
            minHeight: "140px",
            maxHeight: "280px",
            objectFit: "cover",
          }}
          loading="lazy"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-black/50 text-white border-none text-[10px] px-1.5 py-0.5 rounded-md backdrop-blur-sm">
            4K
          </Badge>
        </div>
        {isAdmin && (
          <button
            type="button"
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center hover:bg-destructive transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wallpaper.id);
            }}
            data-ocid={`wallpaper.delete_button.${ocidIndex}`}
            title="Delete wallpaper"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-[14px] text-foreground leading-tight line-clamp-1">
            {wallpaper.title}
          </h3>
          <Badge
            variant="secondary"
            className="text-[10px] font-medium px-1.5 py-0 flex-shrink-0 rounded-md"
          >
            {wallpaper.category}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="flex-1 h-8 text-xs font-medium bg-foreground text-primary-foreground hover:opacity-90 transition-opacity rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onDownload(wallpaper.id, imageUrl);
            }}
            data-ocid={`wallpaper.download_button.${ocidIndex}`}
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Download
          </Button>

          <button
            type="button"
            className="flex items-center gap-1 text-muted-foreground hover:text-rose-500 transition-colors px-2 py-1 rounded-lg hover:bg-rose-50"
            onClick={(e) => {
              e.stopPropagation();
              onLike(wallpaper.id);
            }}
            data-ocid={`wallpaper.like_button.${ocidIndex}`}
          >
            <Heart className="w-4 h-4" />
            <span className="text-[11px] font-medium">
              {wallpaper.likes.toString()}
            </span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1 text-muted-foreground px-2 py-1 rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
              onClick(wallpaper);
            }}
            data-ocid={`wallpaper.comment_button.${ocidIndex}`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[11px] font-medium">
              {wallpaper.comments.length}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
