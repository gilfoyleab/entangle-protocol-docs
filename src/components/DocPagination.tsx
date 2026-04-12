import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAdjacentPages } from "@/lib/docs-data";

interface DocPaginationProps {
  slug: string;
}

export function DocPagination({ slug }: DocPaginationProps) {
  const { prev, next } = getAdjacentPages(slug);

  return (
    <div className="flex items-center justify-between mt-12 pt-6 border-t border-border">
      {prev ? (
        <Link
          to={`/docs/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Previous</div>
            <div className="font-medium text-foreground">{prev.title}</div>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={`/docs/${next.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right"
        >
          <div>
            <div className="text-xs text-muted-foreground mb-0.5">Next</div>
            <div className="font-medium text-foreground">{next.title}</div>
          </div>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
