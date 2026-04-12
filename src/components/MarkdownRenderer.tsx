import { useState, useCallback } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import { Copy, Check } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="code-copy-btn"
      aria-label={copied ? "Copied" : "Copy code"}
    >
      {copied ? (
        <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Copied</span>
      ) : (
        <span className="flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</span>
      )}
    </button>
  );
}

const components: Components = {
  h1: ({ children }) => <h1>{children}</h1>,
  h2: ({ children, ...props }) => {
    const text = typeof children === 'string' ? children : String(children);
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h2 id={id}>{children}</h2>;
  },
  h3: ({ children }) => {
    const text = typeof children === 'string' ? children : String(children);
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    return <h3 id={id}>{children}</h3>;
  },
  code: ({ className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const isBlock = match || (typeof children === 'string' && children.includes('\n'));

    if (isBlock) {
      const codeString = typeof children === 'string' ? children : String(children);
      return (
        <div className="code-block-wrapper relative mb-4 rounded-lg overflow-hidden">
          {match && (
            <div className="bg-code-block px-4 py-1.5 text-xs font-mono border-b opacity-60" style={{ color: "hsl(var(--code-block-fg))", borderColor: "hsl(var(--sidebar-border))" }}>
              {match[1]}
            </div>
          )}
          <CopyButton text={codeString.replace(/\n$/, '')} />
          <pre className="bg-code-block text-code-block-fg p-4 overflow-x-auto font-mono text-sm leading-relaxed !mb-0">
            <code>{children}</code>
          </pre>
        </div>
      );
    }

    return <code className={className} {...props}>{children}</code>;
  },
  pre: ({ children }) => <>{children}</>,
  blockquote: ({ children }) => (
    <blockquote>{children}</blockquote>
  ),
  table: ({ children }) => <table>{children}</table>,
  a: ({ href, children }) => (
    <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
      {children}
    </a>
  ),
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="doc-prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
