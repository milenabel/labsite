import Image from "next/image";

interface HeaderBannerProps {
  title: string;
  subtitle?: string;
  imgSrc?: string;                 
  variant?: "default" | "background";
}

export default function HeaderBanner({
  title,
  subtitle,
  imgSrc,
  variant = "default",
}: HeaderBannerProps) {
  if (variant === "background") {
    return (
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white">
        {/* Optional image; if absent, the gradient shows */}
        {imgSrc && (
          <Image
            src={imgSrc}
            alt=""
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient/overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-lg md:text-xl drop-shadow-md">{subtitle}</p>
          )}
        </div>
      </section>
    );
  }

  // default (side-by-side) layout
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 items-center md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-3 text-gray-600">{subtitle}</p>}
        </div>
        {imgSrc && (
          <div className="relative h-56 md:h-64">
            <Image src={imgSrc} alt="" fill className="object-cover rounded-xl" />
          </div>
        )}
      </div>
    </section>
  );
}
