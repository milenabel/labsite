import HeaderBanner from "@/components/HeaderBanner";
import GalleryCard, { type GalleryItem } from "@/components/GalleryCard";
import data from "@/data/gallery.json";

function sortByDateDesc(items: GalleryItem[]) {
  // Use ISO dates for reliable sort; if missing/invalid, push to end
  return [...items].sort((a, b) => {
    const da = a.date ? Date.parse(a.date) : NaN;
    const db = b.date ? Date.parse(b.date) : NaN;
    if (isNaN(da) && isNaN(db)) return 0;
    if (isNaN(da)) return 1;
    if (isNaN(db)) return -1;
    return db - da;
  });
}

export default function GalleryPage() {
  const items = sortByDateDesc(data as GalleryItem[]);

  return (
    <>
      <HeaderBanner
        title="Gallery"
        subtitle="Beyond pushing modern science forward, we also know how to have fun!"
        imgSrc="/hero/activity.png"      
        variant="background"
      />

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <GalleryCard key={i} item={item} />
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-gray-600">No photos yet. Check back soon!</div>
        )}
      </div>
    </>
  );
}
