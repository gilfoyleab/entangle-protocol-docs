const markdownFiles = import.meta.glob('/src/content/docs/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export function getMarkdownContent(slug: string): string | undefined {
  const key = `/src/content/docs/${slug}.md`;
  return markdownFiles[key];
}

export function extractHeadings(markdown: string): { id: string; title: string; level: number }[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: { id: string; title: string; level: number }[] = [];
  let match;
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const id = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    headings.push({ id, title, level });
  }
  return headings;
}
