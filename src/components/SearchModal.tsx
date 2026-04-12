import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, ArrowRight } from "lucide-react";
import { docsStructure } from "@/lib/docs-data";
import { getMarkdownContent } from "@/lib/markdown-loader";

interface SearchResult {
    slug: string;
    title: string;
    section: string;
    snippet: string;
}

interface SearchModalProps {
    open: boolean;
    onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    // Search logic
    const search = useCallback((q: string) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        const lower = q.toLowerCase();
        const found: SearchResult[] = [];

        for (const section of docsStructure) {
            for (const page of section.pages) {
                const titleMatch = page.title.toLowerCase().includes(lower);
                const descMatch = page.description?.toLowerCase().includes(lower);
                const content = getMarkdownContent(page.slug) || "";
                const contentLower = content.toLowerCase();
                const contentMatch = contentLower.includes(lower);

                if (titleMatch || descMatch || contentMatch) {
                    let snippet = page.description || "";
                    if (contentMatch && !titleMatch) {
                        const idx = contentLower.indexOf(lower);
                        const start = Math.max(0, idx - 40);
                        const end = Math.min(content.length, idx + q.length + 60);
                        snippet = (start > 0 ? "..." : "") + content.slice(start, end).replace(/[#*_`>\n]/g, " ").trim() + (end < content.length ? "..." : "");
                    }
                    found.push({
                        slug: page.slug,
                        title: page.title,
                        section: section.title,
                        snippet,
                    });
                }
            }
        }

        setResults(found);
        setSelectedIndex(0);
    }, []);

    useEffect(() => {
        if (open) {
            setQuery("");
            setResults([]);
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => {
        search(query);
    }, [query, search]);

    // Global keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                // This is handled by the parent — we just stop default
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleNavigate = (slug: string) => {
        navigate(`/docs/${slug}`);
        onClose();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && results[selectedIndex]) {
            handleNavigate(results[selectedIndex].slug);
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className="search-overlay" onClick={onClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search documentation..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground"
                    />
                    <kbd className="text-xs px-1.5 py-0.5 rounded bg-secondary border border-border font-mono text-muted-foreground">
                        ESC
                    </kbd>
                </div>

                {/* Results */}
                <div className="max-h-[360px] overflow-y-auto">
                    {query && results.length === 0 && (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            No results found for "<span className="text-foreground font-medium">{query}</span>"
                        </div>
                    )}

                    {results.map((result, i) => (
                        <div
                            key={result.slug}
                            className={`search-result ${i === selectedIndex ? "selected" : ""}`}
                            onClick={() => handleNavigate(result.slug)}
                            onMouseEnter={() => setSelectedIndex(i)}
                        >
                            <div className="flex items-center gap-2 mb-0.5">
                                <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span className="font-medium text-foreground">{result.title}</span>
                                <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
                            </div>
                            <div className="text-xs text-muted-foreground ml-5.5">
                                <span className="text-primary/70">{result.section}</span>
                                {result.snippet && <span> — {result.snippet}</span>}
                            </div>
                        </div>
                    ))}

                    {!query && (
                        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                            Start typing to search across all documentation pages
                        </div>
                    )}
                </div>

                {/* Footer */}
                {results.length > 0 && (
                    <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                        <span><kbd className="px-1 py-0.5 rounded bg-secondary border border-border font-mono">↑↓</kbd> Navigate</span>
                        <span><kbd className="px-1 py-0.5 rounded bg-secondary border border-border font-mono">↵</kbd> Open</span>
                        <span className="ml-auto">{results.length} result{results.length !== 1 ? "s" : ""}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
