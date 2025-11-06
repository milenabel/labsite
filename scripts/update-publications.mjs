// scripts/update-publications.mjs
// Node 18+ (global fetch), ESM. Run: node scripts/update-publications.mjs
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseStringPromise } from "xml2js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const PEOPLE_JSON = path.join(DATA_DIR, "people.json");
const OUT_JSON = path.join(DATA_DIR, "publications.json");

// helpers
const safeStr = (v) => {
    if (Array.isArray(v)) return v.length ? String(v[0] ?? "") : "";
    if (v == null) return "";
    if (typeof v === "object") {
        // try common fields; otherwise String(v)
        if (typeof v._ === "string") return v._;
        return String(v);
    }
    return String(v);
};

function norm(s) {
    return s.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}
function splitName(s) {
    const parts = norm(s).split(" ").filter(Boolean);
    const first = (parts[0] || "").replace(/\./g, "");
    const last = parts[parts.length - 1] || "";
    const middles = parts.slice(1, -1).map((p) => p.replace(/\./g, ""));
    return { first, last, parts, middles };
}
// students: strict (no middle tokens on author; exact last; first==first OR initial match)
function matchesStudentStrict(authorName, studentName) {
    const a = splitName(authorName);
    const s = splitName(studentName);
    if (!a.last || !s.last || a.last !== s.last) return false;
    if (a.middles.length > 0) return false;
    if (a.first === s.first) return true;
    if (a.first.length === 1 && s.first.length > 0 && a.first[0] === s.first[0]) return true;
    return false;
}
// advisor: looser (last match; allow middles; first==first OR initial match)
function matchesAdvisorLoose(authorName, advisorName) {
    if (!advisorName) return false;
    const a = splitName(authorName);
    const d = splitName(advisorName);
    if (!a.last || !d.last || a.last !== d.last) return false;
    if (a.first === d.first) return true;
    if (a.first.length === 1 && d.first.length > 0 && a.first[0] === d.first[0]) return true;
    return false;
}

async function loadPeople() {
    const raw = await readFile(PEOPLE_JSON, "utf8");
    const data = JSON.parse(raw);
    const students = [
        ...(data.postdoctoral_associates ?? []).map((p) => p.name),
        ...(data.graduate_students ?? []).map((p) => p.name),
        ...(data.undergraduate_students ?? []).map((p) => p.name),
        ...(data.alumni ?? []).map((p) => p.name),
    ].filter(Boolean);
    const advisor = data.advisor?.name;
    return { students, advisor };
}

// arXiv fetch
async function fetchArxivForAuthor(q, max = 50) {
    const url = new URL("https://export.arxiv.org/api/query");
    url.searchParams.set("search_query", q);
    url.searchParams.set("start", "0");
    url.searchParams.set("max_results", String(max));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`arXiv HTTP ${res.status}`);
    const xml = await res.text();
    const json = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
    const feed = json.feed || {};
    const entries = Array.isArray(feed.entry) ? feed.entry : feed.entry ? [feed.entry] : [];
    const out = [];

    for (const e of entries) {
        try {
            // authors
            let authors = [];
            if (Array.isArray(e.author)) {
            authors = e.author.map((a) => safeStr(a?.name)).filter(Boolean);
            } else if (e.author) {
            authors = [safeStr(e.author.name)].filter(Boolean);
            }

            // links
            let linkAbs = "";
            let linkPdf = "";
            if (Array.isArray(e.link)) {
                for (const L of e.link) {
                    const rel = safeStr(L.rel);
                    const href = safeStr(L.href);
                    const title = safeStr(L.title);
                    if (rel === "alternate" && href) linkAbs = href;
                    if (title === "pdf" && href) linkPdf = href;
                }
            } else if (e.link && e.link.href) {
            linkAbs = safeStr(e.link.href);
            }

            // venue / journal_ref (may be object/array)
            const venueRaw = e?.["arxiv:journal_ref"] ?? e?.journal_ref ?? "";
            const venue = safeStr(venueRaw);
            const isPublished = venue.trim().length > 0;

            out.push({
                id: safeStr(e.id),
                title: safeStr(e.title).trim(),
                authors,
                linkAbs,
                linkPdf,
                doi: safeStr(e.doi),
                published: safeStr(e.published),
                isPublished,
                venue,
            });
        } catch (err) {
            console.warn("Skipped one entry due to parse issue:", err?.message);
        }
    }

    return out;
}

function uniqueById(items) {
    const seen = new Map();
    for (const it of items) {
        if (!seen.has(it.id)) seen.set(it.id, it);
    }
    return [...seen.values()];
}

function includesAnyStudent(authors, students) {
    return students.some((s) => authors.some((a) => matchesStudentStrict(a, s)));
}

async function main() {
    await mkdir(DATA_DIR, { recursive: true });
    const { students, advisor } = await loadPeople();

    let all = [];
    for (const s of students) {
        const last = splitName(s).last;
        const queries = [
            `au:${last}`,
            s, // free-text fallback
        ];
        for (const q of queries) {
            try {
                const chunk = await fetchArxivForAuthor(q, 50);
                all.push(...chunk);
            } catch (e) {
                console.error("Query failed:", q, e?.message);
            }
        }
    }

    // Dedup + filter to include at least one student
    all = uniqueById(all).filter((p) => includesAnyStudent(p.authors || [], students));

    // Filter out anything older than 2015
    all = all.filter((p) => {
    const year = Number((p.published || "").slice(0, 4));
    return !isNaN(year) && year >= 2015;
    });

    // Sort newest first
    all.sort((a, b) => (b.published || "").localeCompare(a.published || ""));

    const snapshot = {
        generatedAt: new Date().toISOString(),
        advisor,
        students,
        items: all,
    };
    await writeFile(OUT_JSON, JSON.stringify(snapshot, null, 2), "utf8");
    console.log(`Wrote ${snapshot.items.length} publications → ${path.relative(ROOT, OUT_JSON)}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
