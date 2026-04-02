import { SiGithub, SiInstagram, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`;

  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
                <span className="text-white font-display font-bold text-xs">
                  W
                </span>
              </div>
              <span className="font-display font-bold uppercase tracking-wide text-foreground text-[15px]">
                WALLBASE
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              A curated gallery of high-resolution wallpapers for every screen
              and mood.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">
              Browse
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#discover"
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.discover.link"
                >
                  Discover
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.categories.link"
                >
                  Categories
                </a>
              </li>
              <li>
                <a
                  href="#latest"
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.latest.link"
                >
                  Latest
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">
              Community
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#about"
                  className="hover:text-foreground transition-colors"
                  data-ocid="footer.about.link"
                >
                  About
                </a>
              </li>
              <li>
                <span className="text-muted-foreground/60">
                  Submit Wallpaper
                </span>
              </li>
              <li>
                <span className="text-muted-foreground/60">License Info</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-foreground mb-3">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                data-ocid="footer.twitter.link"
              >
                <SiX className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                data-ocid="footer.instagram.link"
              >
                <SiInstagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                data-ocid="footer.github.link"
              >
                <SiGithub className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} WALLBASE. All rights reserved.</span>
          <span>
            Built with ❤️ using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground/60 hover:text-foreground underline underline-offset-2 transition-colors"
            >
              caffeine.ai
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
