export interface DocPage {
  slug: string;
  title: string;
  description?: string;
  children?: DocPage[];
}

export interface DocSection {
  title: string;
  pages: DocPage[];
}
export const docsStructure: DocSection[] = [
  {
    title: "OVERVIEW",
    pages: [
      { slug: "introduction", title: "Introduction", description: "Introduction documentation" },
      { slug: "why-entangle-exists", title: "Why Entangle Exists", description: "Why Entangle Exists documentation" },
      { slug: "how-it-works-system-overview", title: "System Overview", description: "System Overview documentation" },
    ],
  },
  {
    title: "ARCHITECTURE",
    pages: [
      { slug: "architecture-deep-dive", title: "Architecture Deep Dive", description: "Architecture Deep Dive documentation" },
      { slug: "the-dual-miner-model", title: "The Dual-Miner Model", description: "The Dual-Miner Model documentation" },
      { slug: "validators", title: "Validators", description: "Validators documentation" },
    ],
  },
  {
    title: "PROTOCOL",
    pages: [
      { slug: "scoring-incentives", title: "Scoring & Incentives", description: "Scoring & Incentives documentation" },
      { slug: "smart-contracts", title: "Smart Contracts", description: "Smart Contracts documentation" },
      { slug: "dapp-integration-guide", title: "dApp Integration Guide", description: "dApp Integration Guide documentation" },
    ],
  },
  {
    title: "OPERATIONS",
    pages: [
      { slug: "running-a-miner", title: "Running a Miner", description: "Running a Miner documentation" },
      { slug: "supported-chains-ecosystem-adapters", title: "Supported Chains & Ecosystem Adapters", description: "Supported Chains & Ecosystem Adapters documentation" },
      { slug: "fee-model-gas-oracle", title: "Fee Model & Gas Oracle", description: "Fee Model & Gas Oracle documentation" },
    ],
  },
  {
    title: "ECONOMICS & SAFETY",
    pages: [
      { slug: "security-model", title: "Security Model", description: "Security Model documentation" },
      { slug: "tokenomics-economics", title: "Tokenomics & Economics", description: "Tokenomics & Economics documentation" },
      { slug: "governance", title: "Governance", description: "Governance documentation" },
      { slug: "risk-factors-mitigations", title: "Risk Factors & Mitigations", description: "Risk Factors & Mitigations documentation" },
      { slug: "roadmap", title: "Roadmap", description: "Roadmap documentation" },
      { slug: "glossary", title: "Glossary", description: "Glossary documentation" },
    ],
  },
];

export function getPageBySlug(slug: string): DocPage | undefined {
  const findPage = (pages: DocPage[]): DocPage | undefined => {
    for (const page of pages) {
      if (page.slug === slug) return page;
      if (page.children) {
        const found = findPage(page.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  for (const section of docsStructure) {
    const page = findPage(section.pages);
    if (page) return page;
  }
  return undefined;
}

export function getSectionBySlug(slug: string): DocSection | undefined {
  const hasPage = (pages: DocPage[]): boolean => {
    for (const page of pages) {
      if (page.slug === slug) return true;
      if (page.children && hasPage(page.children)) return true;
    }
    return false;
  };

  for (const section of docsStructure) {
    if (hasPage(section.pages)) return section;
  }
  return undefined;
}

export function getAdjacentPages(slug: string): { prev?: DocPage; next?: DocPage } {
  const flattenPages = (pages: DocPage[]): DocPage[] => {
    return pages.reduce((acc: DocPage[], page) => {
      acc.push(page);
      if (page.children) acc.push(...flattenPages(page.children));
      return acc;
    }, []);
  };

  const allPages = docsStructure.flatMap((s) => flattenPages(s.pages));
  const idx = allPages.findIndex((p) => p.slug === slug);
  return {
    prev: idx > 0 ? allPages[idx - 1] : undefined,
    next: idx < allPages.length - 1 ? allPages[idx + 1] : undefined,
  };
}
