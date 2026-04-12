import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { docsStructure } from "@/lib/docs-data";
import { X, ChevronDown, ChevronRight, BookOpen, AlertTriangle, Cpu, Network, BarChart3, Award, Map } from "lucide-react";

interface DocSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const sectionIcons: Record<string, typeof BookOpen> = {
  "Introduction": BookOpen,
  "Problem & Philosophy": AlertTriangle,
  "How Entangle Works": Cpu,
  "Decentralized Intelligence": Network,
  "Benchmarking & Research": BarChart3,
  "Value Proposition": Award,
  "Roadmap": Map,
};

export function DocSidebar({ mobileOpen, onClose }: DocSidebarProps) {
  const location = useLocation();
  const currentSlug = location.pathname.replace("/docs/", "") || "introduction";

  // Track which sections are open — auto-expand the one containing active page
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of docsStructure) {
      const isActive = section.pages.some((p) => p.slug === currentSlug);
      initial[section.title] = isActive;
    }
    return initial;
  });

  // Update open sections when route changes
  useEffect(() => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const section of docsStructure) {
        if (section.pages.some((p) => p.slug === currentSlug)) {
          next[section.title] = true;
        }
      }
      return next;
    });
  }, [currentSlug]);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-14 left-0 z-50 h-[calc(100vh-3.5rem)] w-[280px] bg-background border-r border-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Mobile close */}
        <div className="lg:hidden flex items-center justify-end px-3 py-2">
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto pt-6 pb-12 px-4 space-y-8 scrollbar-none">
          {/* Main Links (Optional, can add like Ridges Site/Discord if needed) */}

          {docsStructure.map((section) => {
            const hasActivePage = section.pages.some((p) => p.slug === currentSlug);

            return (
              <div key={section.title} className="sidebar-section-container">
                <div className="flex items-center justify-between pr-4">
                  <h4 className={`sidebar-section-title transition-colors duration-200 ${hasActivePage ? "active" : ""}`}>
                    {section.title}
                  </h4>
                </div>

                <div className="sidebar-links-container">
                  {section.pages.map((page) => (
                    <div key={page.slug} className="space-y-1">
                      <Link
                        to={`/docs/${page.slug}`}
                        className={`sidebar-link ${currentSlug === page.slug ? "active" : ""}`}
                        onClick={onClose}
                      >
                        <span>{page.title}</span>
                      </Link>
                      
                      {/* Render nested children if present */}
                      {page.children && (
                        <div className="pl-4 space-y-1 border-l border-border/50 ml-4">
                          {page.children.map((child) => (
                            <Link
                              key={child.slug}
                              to={`/docs/${child.slug}`}
                              className={`sidebar-link text-[13px] ${currentSlug === child.slug ? "active" : ""}`}
                              onClick={onClose}
                            >
                              <span className="truncate">{child.title}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Powered by <span className="font-medium text-foreground">Entangle Docs</span>
          </div>
        </div>
      </aside>
    </>
  );
}
