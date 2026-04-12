import { DocLayout } from "@/components/DocLayout";
import { DocBreadcrumb } from "@/components/DocBreadcrumb";
import { DocToc } from "@/components/DocToc";
import { DocPagination } from "@/components/DocPagination";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useParams } from "react-router-dom";
import { getPageBySlug } from "@/lib/docs-data";
import { getMarkdownContent, extractHeadings } from "@/lib/markdown-loader";

export default function GenericDocPage() {
  const { slug } = useParams<{ slug: string }>();
  const page = getPageBySlug(slug || "");
  const content = getMarkdownContent(slug || "");

  if (!page) {
    return (
      <DocLayout>
        <div className="doc-prose">
          <h1>Page Not Found</h1>
          <p>The documentation page you're looking for doesn't exist.</p>
        </div>
      </DocLayout>
    );
  }

  const markdown = content || `# ${page.title}\n\n${page.description || ''}\n\n---\n\nThis page is a placeholder. Add content by creating \`src/content/docs/${page.slug}.md\`.`;
  const tocItems = extractHeadings(markdown);

  return (
    <DocLayout>
      <div className="flex gap-10">
        <div className="flex-1 min-w-0 max-w-[var(--content-max-width)]">
          <DocBreadcrumb slug={page.slug} title={page.title} />
          <MarkdownRenderer content={markdown} />
          <DocPagination slug={page.slug} />
        </div>
        <DocToc items={tocItems} />
      </div>
    </DocLayout>
  );
}
