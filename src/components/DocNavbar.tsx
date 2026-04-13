import { useState, useEffect, useCallback } from "react";
import { Book, Search, Menu, Github, ExternalLink, Rocket } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchModal } from "@/components/SearchModal";

interface DocNavbarProps {
  onMenuToggle: () => void;
}

export function DocNavbar({ onMenuToggle }: DocNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Global ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6">
        {/* Left Column: Logo & Menu */}
        <div className="flex-1 flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-1.5 rounded-md hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-2.5">
            <a href="https://entangle-eight.vercel.app/" target="_blank" rel="noopener noreferrer">
              <img
                src="/entangle-logo.png"
                alt="Entangle Logo"
                className="w-6 h-6 brightness-200 grayscale transition-all hover:brightness-100 hover:scale-105"
              />
            </a>
            <Link to="/docs/introduction" className="flex items-center gap-2.5">
              <span className="font-semibold text-[15px] tracking-tight">
                Entangle Docs
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground font-medium px-1.5 py-0.5 rounded bg-secondary">
                v2.0
              </span>
            </Link>
          </div>
        </div>

        {/* Center Column: Search Bar */}
        <div className="hidden lg:flex flex-1 justify-center">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 h-9 rounded-xl border border-border/40 bg-secondary/40 dark:bg-[#0a0a10] hover:bg-secondary/60 dark:hover:bg-secondary/40 transition-all text-sm text-muted-foreground w-full max-w-[440px] shadow-sm group relative overflow-hidden dark:shadow-[0_0_15px_rgba(99,102,241,0.1)] dark:border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Search className="w-4 h-4 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
            <span className="flex-1 text-left">Search ...</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-background/50 border border-border/50 font-mono text-muted-foreground/70">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Column: Actions */}
        <div className="flex-1 flex items-center justify-end gap-2">
          {/* Mobile Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-secondary text-muted-foreground transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-1">
            <a
              href="/final_whitepaper.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{ backgroundColor: "white", color: "black" }}
            >
              <span style={{ color: "#000000" }}>White Paper</span>
            </a>

            <a
              href="#"
              className="p-2 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="w-[18px] h-[18px]" />
            </a>
          </div>
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
