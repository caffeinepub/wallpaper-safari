import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

interface HeroSectionProps {
  categories: string[];
  selectedCategory: string;
  onCategorySelect: (cat: string) => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  All: "✦",
  Nature: "🌿",
  Abstract: "◈",
  Architecture: "🏛",
  Space: "🌌",
  Animals: "🦋",
  Minimal: "◻",
  Cars: "🏎",
  Dark: "◈",
  Anime: "⛩",
  City: "🌆",
  Ocean: "🌊",
};

function getCategoryEmoji(cat: string): string {
  return CATEGORY_EMOJIS[cat] ?? "✦";
}

export default function HeroSection({
  categories,
  selectedCategory,
  onCategorySelect,
}: HeroSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  const allCategories = ["All", ...categories];

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ minHeight: "320px" }}
      id="discover"
      data-ocid="hero.section"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/generated/hero-bg.dim_1400x400.jpg')",
        }}
      />
      <div className="absolute inset-0 hero-overlay" />

      <div className="relative z-10 max-w-[1320px] mx-auto px-6 pt-14 pb-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="font-display font-extrabold uppercase tracking-tight text-white text-4xl md:text-5xl lg:text-[52px] leading-none mb-3">
            EXPLORE VIBRANT WALLPAPERS.
          </h1>
          <p className="text-[#D1D5DB] text-lg md:text-xl font-normal mb-1">
            Download stunning wallpapers for every screen.
          </p>
          <p className="text-[#9CA3AF] text-sm font-normal">
            Free to use · High resolution · New uploads daily
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 mt-8 border-t border-white/10">
        <div className="max-w-[1320px] mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mr-2 flex-shrink-0">
              Browse
            </span>

            <button
              type="button"
              onClick={() => scroll("left")}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              data-ocid="hero.categories.pagination_prev"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto flex-1"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              id="categories"
            >
              {allCategories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  data-ocid="hero.categories.tab"
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat
                      ? "bg-white text-foreground shadow-sm"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <span>{getCategoryEmoji(cat)}</span>
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => scroll("right")}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              data-ocid="hero.categories.pagination_next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
