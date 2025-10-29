import HeaderBanner from "@/components/HeaderBanner";
import people from "@/data/people.json";
import { fetchArxivForAuthors, groupByYear, type ArxivItem } from "@/lib/arxiv";
import katex from "katex";

export const revalidate = 3600;

/* LaTeX in titles */

// Minimal HTML escape for non-math text chunks
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Render a plain text string with inline math delimited by $...$
 * We split by '$' into segments: even indexes = text, odd indexes = math.
 */
function renderTitleWithLatexToHtml(title: string): string {
  const parts = title.split("$");
  let html = "";

  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    if (i % 2 === 0) {
      // outside math -> escape
      html += escapeHtml(seg);
    } else {
      // inside math -> render with KaTeX
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

/* Name helpers */

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

/**
 * Strict student match:
 * - last names identical
 * - NO middle tokens on the author side (students have no middles)
 * - author first == student first OR author's first is a single-letter initial matching student's first initial
 * - otherwise reject
 */
function matchesStudentStrict(authorName: string, studentName: string) {
  const a = splitName(authorName);
  const s = splitName(studentName);

  if (!a.last || !s.last || a.last !== s.last) return false;
  if (a.middles.length > 0) return false;

  if (a.first === s.first) return true;
  if (a.first.length === 1 && s.first.length > 0 && a.first[0] === s.first[0]) return true;

  return false;
}

/** Advisor match: last = last, and first == first OR first-initial matches; allow middles */
function matchesAdvisorLoose(authorName: string, advisorName: string) {
  const a = splitName(authorName);
  const d = splitName(advisorName);
  if (!a.last || !d.last || a.last !== d.last) return false;
  if (a.first === d.first) return true;
  if (a.first.length === 1 && d.first.length > 0 && a.first[0] === d.first[0]) return true;
  return false;
}

/* People helpers */

function authorNamesFromPeople(data: any) {
  const students = [
    ...(data.postdoctoral_associates ?? []).map((p: any) => p.name),
    ...(data.graduate_students ?? []).map((p: any) => p.name),
    ...(data.undergraduate_students ?? []).map((p: any) => p.name),
    ...(data.alumni ?? []).map((p: any) => p.name),
  ].filter(Boolean);

  const advisor = data.advisor?.name as string | undefined;
  return { students, advisor };
}

/* Rendering */

function renderAuthorsLine(
  authors: string[],
  students: string[],
  advisor?: string,
  maxShown = 13
) {
  const isAdvisor = (name: string) => (advisor ? matchesAdvisorLoose(name, advisor) : false);
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

/* Page */

export default async function PublicationsPage() {
  const { students, advisor } = authorNamesFromPeople(people as any);

  const fetched = await fetchArxivForAuthors(students, 150);
  const items = fetched.filter((p) =>
    p.authors.some((a) => students.some((s) => matchesStudentStrict(a, s)))
  );

  items.sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));
  const byYear = groupByYear(items);

  return (
    <>
      <HeaderBanner
        title="Publications"
        subtitle="Recent preprints and publications by our students and alumni"
        imgSrc="/hero/publications.jpg"
        variant="background"
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        {Object.keys(byYear)
          .sort((a, b) => +b - +a)
          .map((year) => (
            <section key={year} className="mb-10">
              <h2 className="text-xl font-semibold">{year}</h2>
              <ul className="mt-4 space-y-4">
                {byYear[year].map((p: ArxivItem) => {
                  const titleHtml = renderTitleWithLatexToHtml(p.title);
                  return (
                    <li key={p.id} className="rounded-xl border border-gray-200 p-4">
                      {/* Bold title with KaTeX-rendered inline math */}
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
                      <div className="text-sm mt-2 space-x-3">
                        <a className="underline" href={p.linkAbs} target="_blank" rel="noopener noreferrer">
                          arXiv
                        </a>
                        {p.linkPdf && (
                          <a className="underline" href={p.linkPdf} target="_blank" rel="noopener noreferrer">
                            PDF
                          </a>
                        )}
                        {p.doi && (
                          <a
                            className="underline"
                            href={`https://doi.org/${p.doi}`}
                            target="_blank"
                            rel="noopener noreferrer"
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
          <div className="text-gray-600">No publications found yet for the listed authors.</div>
        )}
      </div>
    </>
  );
}
