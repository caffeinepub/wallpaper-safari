import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { ImageOff, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Wallpaper } from "./backend";
import Footer from "./components/Footer";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import UploadModal from "./components/UploadModal";
import WallpaperCard from "./components/WallpaperCard";
import WallpaperModal from "./components/WallpaperModal";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import {
  useDeleteWallpaper,
  useDownloadWallpaper,
  useGetAllWallpapers,
  useIsAdmin,
  useLikeWallpaper,
} from "./hooks/useQueries";

const PAGE_SIZE = 12;

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(
    null,
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;

  const { data: wallpapers = [], isLoading, isError } = useGetAllWallpapers();
  const { data: isAdmin = false } = useIsAdmin();

  const likeWallpaper = useLikeWallpaper();
  const downloadWallpaper = useDownloadWallpaper();
  const deleteWallpaper = useDeleteWallpaper();

  const categories = useMemo(() => {
    const set = new Set(wallpapers.map((w) => w.category));
    return Array.from(set).sort();
  }, [wallpapers]);

  const filtered = useMemo(() => {
    let result = wallpapers;
    if (selectedCategory !== "All") {
      result = result.filter((w) => w.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q),
      );
    }
    return [...result].sort((a, b) => Number(b.uploadedAt - a.uploadedAt));
  }, [wallpapers, selectedCategory, searchQuery]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleLike = async (id: string) => {
    try {
      await likeWallpaper.mutateAsync(id);
    } catch {
      toast.error("Failed to like wallpaper");
    }
  };

  const handleDownload = async (id: string, url: string) => {
    try {
      await downloadWallpaper.mutateAsync({ id, url });
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this wallpaper?")) return;
    try {
      await deleteWallpaper.mutateAsync(id);
      toast.success("Wallpaper deleted");
      if (selectedWallpaper?.id === id) setSelectedWallpaper(null);
    } catch {
      toast.error("Failed to delete wallpaper");
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setVisibleCount(PAGE_SIZE);
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch {
      toast.error("Login failed");
    }
  };

  const skeletonKeys = ["sk0", "sk1", "sk2", "sk3", "sk4", "sk5", "sk6", "sk7"];
  const skeletonHeights = [160, 220, 160, 280, 220, 160, 280, 220];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster richColors position="top-right" />

      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        isAdmin={isAdmin}
        onUploadClick={() => setUploadOpen(true)}
        onLoginClick={handleLogin}
        isLoggedIn={isLoggedIn}
        onLogout={clear}
      />

      <main className="flex-1">
        <HeroSection
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <section className="max-w-[1320px] mx-auto px-6 py-10" id="latest">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-[17px] text-foreground">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : selectedCategory !== "All"
                    ? selectedCategory
                    : "Discover"}
              </h2>
              {!isLoading && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {filtered.length} wallpaper{filtered.length !== 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {["All", ...categories].slice(0, 6).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  data-ocid="gallery.filter.tab"
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-foreground text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="masonry-grid" data-ocid="gallery.loading_state">
              {skeletonKeys.map((k, i) => (
                <div key={k} className="masonry-item">
                  <Skeleton
                    className="w-full rounded-xl"
                    style={{ height: `${skeletonHeights[i]}px` }}
                  />
                </div>
              ))}
            </div>
          )}

          {isError && (
            <div
              className="flex flex-col items-center justify-center py-24 gap-3"
              data-ocid="gallery.error_state"
            >
              <ImageOff className="w-10 h-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Failed to load wallpapers. Please try refreshing.
              </p>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
              data-ocid="gallery.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              {wallpapers.length === 0 ? (
                <>
                  <h3 className="font-semibold text-foreground text-lg">
                    No wallpapers yet
                  </h3>
                  <p className="text-sm text-muted-foreground text-center max-w-xs">
                    {isAdmin
                      ? "You're an admin! Click Upload to add the first wallpaper."
                      : "No wallpapers yet. Admin can upload the first one!"}
                  </p>
                  {isAdmin && (
                    <Button
                      onClick={() => setUploadOpen(true)}
                      className="bg-foreground text-primary-foreground hover:opacity-90"
                      data-ocid="gallery.upload.primary_button"
                    >
                      Upload First Wallpaper
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-foreground">
                    No results found
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search or category.
                  </p>
                  <button
                    type="button"
                    className="text-sm font-medium underline underline-offset-2 text-foreground/60 hover:text-foreground"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All");
                    }}
                    data-ocid="gallery.reset.button"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </motion.div>
          )}

          {!isLoading && !isError && visible.length > 0 && (
            <AnimatePresence mode="wait">
              <div className="masonry-grid" data-ocid="gallery.list">
                {visible.map((wallpaper, i) => (
                  <WallpaperCard
                    key={wallpaper.id}
                    wallpaper={wallpaper}
                    isAdmin={isAdmin}
                    onLike={handleLike}
                    onDownload={handleDownload}
                    onDelete={handleDelete}
                    onClick={setSelectedWallpaper}
                    index={i}
                  />
                ))}
              </div>
            </AnimatePresence>
          )}

          {hasMore && !isLoading && (
            <div className="flex justify-center mt-10">
              <Button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                variant="outline"
                className="px-8 h-11 rounded-full font-medium border-border hover:bg-secondary text-sm"
                data-ocid="gallery.load_more.button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <WallpaperModal
        wallpaper={selectedWallpaper}
        onClose={() => setSelectedWallpaper(null)}
      />

      {isAdmin && (
        <UploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      )}
    </div>
  );
}
