import { ReactNode } from "react";

interface CodeBlockProps {
  language?: string;
  children: ReactNode;
}

export function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="relative mb-4 rounded-lg overflow-hidden">
      {language && (
        <div className="bg-code-block px-4 py-1.5 text-xs font-mono border-b opacity-60" style={{ color: "hsl(var(--code-block-fg))", borderColor: "hsl(var(--sidebar-border))" }}>
          {language}
        </div>
      )}
      <pre className="bg-code-block text-code-block-fg p-4 overflow-x-auto font-mono text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}
