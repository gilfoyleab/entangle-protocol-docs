import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getSectionBySlug } from "@/lib/docs-data";

interface DocBreadcrumbProps {
  slug: string;
  title: string;
}

export function DocBreadcrumb({ slug, title }: DocBreadcrumbProps) {
  const section = getSectionBySlug(slug);

  return (
    <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
      <Link to="/docs/introduction" className="hover:text-foreground transition-colors">
        Docs
      </Link>
      {section && (
        <>
          <ChevronRight className="w-3.5 h-3.5" />
          <span>{section.title}</span>
        </>
      )}
      <ChevronRight className="w-3.5 h-3.5" />
      <span className="text-foreground font-medium">{title}</span>
    </nav>
  );
}
