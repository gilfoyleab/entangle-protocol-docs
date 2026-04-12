import { DocSidebar } from "@/components/DocSidebar";
import { DocNavbar } from "@/components/DocNavbar";
import { ReactNode, useState } from "react";

interface DocLayoutProps {
  children: ReactNode;
}

export function DocLayout({ children }: DocLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DocNavbar onMenuToggle={() => setMobileOpen((v) => !v)} />
      <DocSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <main className="lg:pl-[280px] pt-14">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
          {children}
        </div>
      </main>
    </div>
  );
}
