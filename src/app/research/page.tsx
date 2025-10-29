import HeaderBanner from "@/components/HeaderBanner";
import funding from "@/data/funding.json";
import projects from "@/data/research.json";

type Funder = { name: string; logo?: string };
type Project = { title: string; summary?: string; link?: string };

export default function ResearchPage() {
  const funders = funding as Funder[];
  const items = projects as Project[];

  return (
    <>
      <HeaderBanner
        title="Research"
        subtitle="Our lab has many projects we are working on. Take a look!"
        imgSrc="/hero/research.jpg"
        variant="background"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* Funding */}
        <section className="text-center">
          <h2 className="text-xl font-semibold">Funding</h2>
          <p className="mt-2 text-gray-700">
            We are grateful for receiving support from the following organizations:
          </p>

          {/* Names list */}
          <ul className="mt-4 list-disc list-inside text-gray-800 inline-block text-left">
            {funders.map((f, i) => (
              <li key={i}>{f.name}</li>
            ))}
          </ul>

          {/* Logos centered, transparent, no border */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-8">
            {funders.map((f, i) => (
              <div key={i} className="flex items-center justify-center">
                {f.logo ? (
                  <img
                    src={f.logo}
                    alt={f.name}
                    className="h-16 w-auto object-contain"
                    title={f.name}
                  />
                ) : (
                  <span className="text-sm text-gray-500">{f.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Current Projects */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-center">Current Projects</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            {items.map((p, i) => (
              <article
                key={i}
                className="rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <h3 className="font-semibold">{p.title}</h3>
                {p.summary && <p className="mt-2 text-sm text-gray-700">{p.summary}</p>}
                {p.link && p.link !== "#" && (
                  <a href={p.link} className="mt-3 inline-block text-sm underline">
                    Learn more
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
