import HeaderBanner from "@/components/HeaderBanner";
import snapshot from "@/data/publications.json"; // ← generated file
import katex from "katex";

// Types that match the generator output
type Snapshot = {
  generatedAt: string;
  advisor?: string;
  students: string[];
  items: ArxivItem[];
};

export type ArxivItem = {
  id: string;
  title: string;
  authors: string[];
  linkAbs?: string;
  linkPdf?: string;
  doi?: string;
  published?: string;
  isPublished?: boolean;
  venue?: string;
};

// ----- same matching/render helpers you already used -----
function norm(s: string) {
  return s.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}
function splitName(s: string) {
  const parts = norm(s).split(" ").filter(Boolean);
  const first = (parts[0] || "").replace(/\./g, "");
  const last = parts[parts.length - 1] || "";
  const middles = parts.slice(1, -1).map((p) => p.replace(/\./g, ""));
  return { first, last, parts, middles };
}
function matchesStudentStrict(authorName: string, studentName: string) {
  const a = splitName(authorName);
  const s = splitName(studentName);
  if (!a.last || !s.last || a.last !== s.last) return false;
  if (a.middles.length > 0) return false;
  if (a.first === s.first) return true;
  if (a.first.length === 1 && s.first.length > 0 && a.first[0] === s.first[0]) return true;
  return false;
}
function matchesAdvisorLoose(authorName: string, advisorName?: string) {
  if (!advisorName) return false;
  const a = splitName(authorName);
  const d = splitName(advisorName);
  if (!a.last || !d.last || a.last !== d.last) return false;
  if (a.first === d.first) return true;
  if (a.first.length === 1 && d.first.length > 0 && a.first[0] === d.first[0]) return true;
  return false;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function renderTitleWithLatexToHtml(title: string): string {
  const parts = title.split("$");
  let html = "";
  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    if (i % 2 === 0) {
      html += escapeHtml(seg);
    } else {
      try {
        html += katex.renderToString(seg, {
          throwOnError: false,
          displayMode: false,
          output: "html",
          strict: "ignore",
        });
      } catch {
        html += `<code>${escapeHtml(seg)}</code>`;
      }
    }
  }
  return html;
}

function groupByYear(items: ArxivItem[]) {
  const out: Record<string, ArxivItem[]> = {};
  for (const it of items) {
    const y = (it.published || "").slice(0, 4) || "Unknown";
    (out[y] ||= []).push(it);
  }
  return out;
}

function renderAuthorsLine(
  authors: string[],
  students: string[],
  advisor?: string,
  maxShown = 13
) {
  const isAdvisor = (name: string) => matchesAdvisorLoose(name, advisor);
  const isStudent = (name: string) => students.some((s) => matchesStudentStrict(name, s));
  const shouldBold = (name: string) => isAdvisor(name) || isStudent(name);

  const shown = authors.slice(0, maxShown);
  const studentsOnThisPaper = students.filter((s) =>
    authors.some((a) => matchesStudentStrict(a, s))
  );
  const missingStudents = studentsOnThisPaper.filter(
    (s) => !shown.some((a) => matchesStudentStrict(a, s))
  );

  const shownNodes = shown.map((a, i) => {
    const bold = shouldBold(a);
    return (
      <span key={`${a}-${i}`}>
        {bold ? <strong>{a}</strong> : a}
        {i < shown.length - 1 ? ", " : ""}
      </span>
    );
  });

  const tail =
    missingStudents.length > 0 ? (
      <>
        {shown.length ? " " : ""}
        …, <strong>{missingStudents.join(", ")}</strong>, …
      </>
    ) : null;

  return (
    <div className="text-sm text-gray-700 mt-1">
      {shownNodes}
      {tail}
    </div>
  );
}

// ---- PAGE (purely static: reads JSON) ----
export const dynamic = "force-static"; // ensure SSG
export default function PublicationsPage() {
  const snap = snapshot as Snapshot;
  const { students, advisor } = snap;
  const items = snap.items ?? [];

  // newest first per year
  const byYear = groupByYear(items);

  return (
    <>
      <HeaderBanner
        title="Publications"
        subtitle="Recent preprints and publications by our students and alumni"
        imgSrc="/hero/publication.png"
        variant="background"
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {Object.keys(byYear)
          .sort((a, b) => +b - +a)
          .map((year) => (
            <section key={year} className="mb-10">
              <h2 className="section-title">{year}</h2>
              <ul className="mt-4 space-y-4">
                {byYear[year].map((p) => {
                  const titleHtml = renderTitleWithLatexToHtml(p.title);
                  return (
                    <li key={p.id} className="card p-4">
                      <div
                        className="font-semibold text-[1.02rem] leading-snug"
                        dangerouslySetInnerHTML={{ __html: `<strong>${titleHtml}</strong>` }}
                      />
                      {renderAuthorsLine(p.authors, students, advisor, 13)}
                      <div className="text-sm mt-2">
                        {p.isPublished ? (
                          <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-emerald-100 text-emerald-700">
                            Published — {p.venue}
                          </span>
                        ) : (
                          <span className="inline-block rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-700">
                            Preprint — arXiv
                          </span>
                        )}
                      </div>
                      <div className="text-sm mt-2 space-x-3" suppressHydrationWarning>
                        {p.linkAbs && (
                          <a
                            className="link"
                            href={p.linkAbs}
                            target="_blank"
                            rel="noopener noreferrer"
                            suppressHydrationWarning
                            contentEditable={false}
                            data-gramm="false"
                            data-gramm_editor="false"
                            style={{ cursor: "pointer" }}
                          >
                            arXiv
                          </a>
                        )}

                        {p.linkPdf && (
                          <a
                            className="link"
                            href={p.linkPdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            suppressHydrationWarning
                            contentEditable={false}
                            data-gramm="false"
                            data-gramm_editor="false"
                            style={{ cursor: "pointer" }}
                          >
                            PDF
                          </a>
                        )}

                        {p.doi && (
                          <a
                            className="link"
                            href={`https://doi.org/${p.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            suppressHydrationWarning
                            contentEditable={false}
                            data-gramm="false"
                            data-gramm_editor="false"
                            style={{ cursor: "pointer" }}
                          >
                            DOI
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

        {items.length === 0 && (
          <div className="text-gray-600">
            No publications found yet. Run <code>npm run update:pubs</code> to generate a snapshot.
          </div>
        )}

        <div className="text-xs text-gray-500 mt-8">
          Snapshot generated at: {new Date(snap.generatedAt || "").toLocaleString() || "n/a"}
        </div>
      </div>
    </>
  );
}