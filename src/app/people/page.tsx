import Image from "next/image";
import HeaderBanner from "@/components/HeaderBanner";
import people from "@/data/people.json";

type Links = {
  scholar?: string;
  linkedin?: string;
  website?: string;
};

type Person = {
  name: string;
  title?: string;
  image?: string;
  research?: string; // new
  bio?: string;      // advisor only
  links?: Links;     // advisor only
};


function ExternalBtn({
  href,
  children,
}: {
  href?: string;
  children: React.ReactNode;
}) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-lg bg-brand-700 text-white px-3 py-1.5 text-xs font-medium hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-300"
    >
      {children}
    </a>
  );
}

function PersonCard({ person }: { person: Person }) {
  const img = person.image || "/people/placeholder.jpg";
  return (
    <article className="card-brand p-4">
      <div className="flex items-start gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border">
          <Image src={img} alt={person.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="font-medium">{person.name}</div>
          {person.title && <div className="text-sm text-gray-600">{person.title}</div>}
          {person.research && (
            <p className="mt-1 text-sm text-gray-700">{person.research}</p>
          )}
        </div>
      </div>
    </article>
  );
}

/* Page */

export default function PeoplePage() {
  const {
    advisor,
    postdoctoral_associates,
    graduate_students,
    undergraduate_students,
    alumni,
  } = people as {
    advisor?: Person;
    postdoctoral_associates: Person[];
    graduate_students: Person[];
    undergraduate_students: Person[];
    alumni: Person[];
  };

  return (
    <>
      <HeaderBanner
        title="People"
        subtitle="Learn more about who we are."
        imgSrc="/hero/peoples.png"
        variant="background"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* Advisor (prominent) */}
        {advisor && (
          <section>
            <h2 className="section-title">Advisor</h2>
            <article className="card-brand p-6">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border">
                  <Image
                    src={advisor.image || "/people/placeholder.jpg"}
                    alt={advisor.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-semibold">{advisor.name}</div>
                  {advisor.title && (
                    <div className="text-sm text-gray-600">{advisor.title}</div>
                  )}

                  {advisor.bio && (
                    <p className="mt-3 whitespace-pre-line text-gray-800">
                      {advisor.bio}
                    </p>
                  )}

                  {/* Links */}
                  {(advisor.links?.scholar ||
                    advisor.links?.linkedin ||
                    advisor.links?.website) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <ExternalBtn href={advisor.links?.scholar}>
                        Google Scholar
                      </ExternalBtn>
                      <ExternalBtn href={advisor.links?.linkedin}>
                        LinkedIn
                      </ExternalBtn>
                      <ExternalBtn href={advisor.links?.website}>
                        Personal Website
                      </ExternalBtn>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Postdocs */}
        <section>
          <h2 className="section-title">Postdoctoral Associates</h2>
          {postdoctoral_associates?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {postdoctoral_associates.map((p, i) => (
                <PersonCard key={i} person={p} />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">No entries yet.</div>
          )}
        </section>

        {/* Graduate students */}
        <section>
          <h2 className="section-title">Graduate Students</h2>
          {graduate_students?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {graduate_students.map((p, i) => (
                <PersonCard key={i} person={p} />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">No entries yet.</div>
          )}
        </section>

        {/* Undergraduate students */}
        <section>
          <h2 className="section-title">Undergraduate Students</h2>
          {undergraduate_students?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {undergraduate_students.map((p, i) => (
                <PersonCard key={i} person={p} />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">No entries yet.</div>
          )}
        </section>

        {/* Alumni */}
        <section>
          <h2 className="section-title">Alumni</h2>
          {alumni?.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alumni.map((p, i) => (
                <PersonCard key={i} person={p} />
              ))}
            </div>
          ) : (
            <div className="text-gray-600 text-sm">No entries yet.</div>
          )}
        </section>
      </div>
    </>
  );
}
