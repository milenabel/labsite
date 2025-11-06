import Image from "next/image";

export type GalleryItem = {
  src: string;
  alt?: string;
  who?: string[];
  event?: string;
  location?: string;
  date?: string;        // ISO "YYYY-MM-DD" preferred
  description?: string;
};

export default function GalleryCard({ item }: { item: GalleryItem }) {
  return (
    <figure className="card-brand overflow-hidden hover:border-brand-300">
      <div className="relative aspect-[4/3] w-full">
        <Image
          src={item.src}
          alt={item.alt || item.event || "Gallery photo"}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          priority={false}
        />
      </div>

      <figcaption className="p-3 text-sm">
        <div className="font-medium">
          {[item.event, item.location, item.date].filter(Boolean).join(" — ")}
        </div>

        {item.who?.length ? (
          <div className="text-gray-700 mt-1">
            <span className="font-semibold">Who:</span> {item.who.join(", ")}
          </div>
        ) : null}

        {item.description ? (
          <div className="text-gray-600 mt-1">{item.description}</div>
        ) : null}
      </figcaption>
    </figure>
  );
}