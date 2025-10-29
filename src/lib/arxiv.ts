import { parseStringPromise } from "xml2js";

export type ArxivItem = {
  id: string;
  title: string;
  authors: string[];
  summary: string;
  linkAbs: string;
  linkPdf?: string;
  published: string;
  updated?: string;
  journal_ref?: string;
  doi?: string;
  primary_category?: string;
  categories: string[];
  year: number;
  venue: string;
  isPublished: boolean;
};

function authorVariants(fullName: string): string[] {
  const name = fullName.trim().replace(/\s+/g, " ");
  if (!name) return [];
  const parts = name.split(" ");
  if (parts.length === 1) return [name]; // single token

  const first = parts[0];
  const last = parts[parts.length - 1];
  const middles = parts.slice(1, -1); // middle names/initials

  const firstInitial = first[0] + ".";
  const middleInitials = middles.map(m => (m.endsWith(".") ? m : m[0] + "."));

  const variants = new Set<string>();

  // Full name
  variants.add(`${first} ${middles.join(" ")} ${last}`.replace(/\s+/g, " ").trim());

  // First-initial Last
  variants.add(`${firstInitial} ${last}`);

  // First + middle-initials + Last 
  if (middles.length) {
    variants.add(`${first} ${middleInitials.join(" ")} ${last}`.replace(/\s+/g, " ").trim());
  }

  // First-initial + middle-initials + Last 
  if (middles.length) {
    variants.add(`${firstInitial} ${middleInitials.join(" ")} ${last}`.replace(/\s+/g, " ").trim());
  }

  return Array.from(variants);
}


// Fetch up to `maxResults` entries where ANY author matches (students/alumni)
export async function fetchArxivForAuthors(authors: string[], maxResults = 150): Promise<ArxivItem[]> {
    if (!authors.length) return [];
    const base = "https://export.arxiv.org/api/query";
    const authorTerms: string[] = [];
    for (const a of authors.filter(Boolean)) {
    for (const v of authorVariants(a)) {
        authorTerms.push(`au:${encodeURIComponent('"' + v + '"')}`);
    }
    }
    const queryAuthors = authorTerms.join("+OR+");

    const url = `${base}?search_query=${queryAuthors}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

    const res = await fetch(url, {
    headers: { "User-Agent": "labsite (mailto:you@example.com)" },
    // cache on the server for 1 hour
    next: { revalidate: 3600 },
  });

  const xml = await res.text();
  const parsed = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
  const feed = parsed?.feed;
  const entries = Array.isArray(feed?.entry) ? feed.entry : feed?.entry ? [feed.entry] : [];

  const items: ArxivItem[] = entries.map((e: any) => {
    const title = (e.title || "").replace(/\s+/g, " ").trim();
    const authors = e.author ? (Array.isArray(e.author) ? e.author.map((a: any) => a.name) : [e.author.name]) : [];
    const links = Array.isArray(e.link) ? e.link : e.link ? [e.link] : [];
    const linkAbs = (links.find((l: any) => l.rel === "alternate")?.href) || e.id;
    const linkPdf = links.find((l: any) => l.title === "pdf" || l.type === "application/pdf")?.href;
    const published = e.published;
    const updated = e.updated;
    const journal_ref = e["arxiv:journal_ref"]?._;
    const doi = e["arxiv:doi"]?._;
    const primary_category = e["arxiv:primary_category"]?.term;
    const categories = (Array.isArray(e.category) ? e.category.map((c: any) => c.term) : e.category ? [e.category.term] : []);
    const year = published ? new Date(published).getFullYear() : new Date().getFullYear();
    const isPublished = !!journal_ref || !!doi;
    const venue = journal_ref ? journal_ref : "arXiv";
    const summary = (e.summary || "").trim();

    return { id: e.id, title, authors, summary, linkAbs, linkPdf, published, updated, journal_ref, doi, primary_category, categories, year, venue, isPublished };
  });

  const map = new Map(items.map(i => [i.id, i]));
  return Array.from(map.values());
}

export function groupByYear(items: ArxivItem[]): Record<string, ArxivItem[]> {
  return items.reduce((acc: Record<string, ArxivItem[]>, it) => {
    const y = String(it.year);
    (acc[y] ||= []).push(it);
    return acc;
  }, {});
}
