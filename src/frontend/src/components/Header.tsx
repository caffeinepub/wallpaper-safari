import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LayoutGrid, Search, Upload, X } from "lucide-react";
import { motion } from "motion/react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  isAdmin: boolean;
  onUploadClick: () => void;
  onLoginClick: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export default function Header({
  searchQuery,
  onSearchChange,
  isAdmin,
  onUploadClick,
  onLoginClick,
  isLoggedIn,
  onLogout,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 flex-shrink-0"
          data-ocid="header.link"
        >
          <img
            src="/assets/generated/wallpaper-safari-logo-transparent.dim_80x80.png"
            alt="Wallpaper Safari Logo"
            className="w-9 h-9 object-contain"
          />
          <span className="font-display font-bold tracking-wide text-foreground text-[17px]">
            Wallpaper Safari
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium text-muted-foreground">
          <a
            href="#discover"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.discover.link"
          >
            Discover
          </a>
          <a
            href="#categories"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.categories.link"
          >
            Categories
          </a>
          <a
            href="#latest"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.latest.link"
          >
            Latest
          </a>
          <a
            href="#about"
            className="hover:text-foreground transition-colors"
            data-ocid="nav.about.link"
          >
            About
          </a>
        </nav>

        <div className="flex-1" />

        {/* Search */}
        <div className="relative hidden sm:block w-[260px] lg:w-[320px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search wallpapers…"
            className="pl-9 bg-secondary border-border rounded-full text-sm h-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            data-ocid="header.search_input"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onSearchChange("")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 ml-2">
          {!isLoggedIn ? (
            <>
              <button
                type="button"
                className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
                onClick={onLoginClick}
                data-ocid="header.login.button"
              >
                Sign In
              </button>
              <button
                type="button"
                className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
                onClick={onLoginClick}
                data-ocid="header.signup.button"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              type="button"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2"
              onClick={onLogout}
              data-ocid="header.logout.button"
            >
              Sign Out
            </button>
          )}

          {isAdmin && (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                onClick={onUploadClick}
                className="h-9 px-4 text-sm font-medium bg-foreground text-white rounded-full hover:opacity-90 transition-opacity"
                data-ocid="header.upload.button"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Upload
              </Button>
            </motion.div>
          )}

          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground ml-1"
            data-ocid="header.menu.button"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
