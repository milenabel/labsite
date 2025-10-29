import Image from "next/image";
import HeaderBanner from "@/components/HeaderBanner";
import people from "@/data/people.json";

type Person = {
  name: string;
  title?: string;
  image?: string;
};

function AvatarRow({ person }: { person: Person }) {
  const img = person.image || "/people/placeholder.jpg";
  return (
    <div className="flex items-center gap-4 p-4 border rounded-xl">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border">
        <Image src={img} alt={person.name} fill className="object-cover" />
      </div>
      <div>
        <div className="font-medium">{person.name}</div>
        {person.title && <div className="text-sm text-gray-600">{person.title}</div>}
      </div>
    </div>
  );
}

export default function PeoplePage() {
  const { advisor, postdoctoral_associates, graduate_students, undergraduate_students, alumni } = people as {
    advisor?: Person;
    postdoctoral_associates: Person[];
    graduate_students: Person[];
    undergraduate_students: Person[];
    alumni: Person[];
  };

  return (
    <>
      <HeaderBanner title="People" imgSrc="/hero/people.PNG" variant="background"  />
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
        {/* Advisor */}
        {advisor && (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Advisor</h2>
            {/* One row: circular image on the left, text on the right */}
            <AvatarRow person={advisor} />
          </section>
        )}

        {/* Postdocs */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Postdoctoral Associates</h2>
          <div className="space-y-3">
            {postdoctoral_associates?.length ? (
              postdoctoral_associates.map((p, i) => <AvatarRow key={i} person={p} />)
            ) : (
              <div className="text-gray-600 text-sm">No entries yet.</div>
            )}
          </div>
        </section>

        {/* Graduate students */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Graduate Students</h2>
          <div className="space-y-3">
            {graduate_students?.length ? (
              graduate_students.map((p, i) => <AvatarRow key={i} person={p} />)
            ) : (
              <div className="text-gray-600 text-sm">No entries yet.</div>
            )}
          </div>
        </section>

        {/* Undergraduate students */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Undergraduate Students</h2>
          <div className="space-y-3">
            {undergraduate_students?.length ? (
              undergraduate_students.map((p, i) => <AvatarRow key={i} person={p} />)
            ) : (
              <div className="text-gray-600 text-sm">No entries yet.</div>
            )}
          </div>
        </section>

        {/* Alumni */}
        <section>
          <h2 className="mb-4 text-xl font-semibold">Alumni</h2>
          <div className="space-y-3">
            {alumni?.length ? (
              alumni.map((p, i) => <AvatarRow key={i} person={p} />)
            ) : (
              <div className="text-gray-600 text-sm">No entries yet.</div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
