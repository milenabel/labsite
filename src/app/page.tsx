import HeaderBanner from "@/components/HeaderBanner";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <HeaderBanner
        title="About Us"
        subtitle="Exploring the frontiers of scientific computing and operator learning."
        imgSrc="/hero/homep.jpg"      // optional; shows gradient if missing
        variant="background"
      />
      <section className="section">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-6">
            <h2 className="text-lg font-semibold text-brand-700">Welcome to our lab!</h2>
            <p className="mt-2 text-gray-700">
              We develop advanced methods in scientific computing, operator learning,
          and machine learning for physical systems. Our work spans DeepONets, PDE solvers, and
          physics-informed neural networks. Explore our{" "}
            <Link className="underline text-brand-700" href="/research" prefetch={false}>
              research
            </Link>{" "}
            and{" "}
            <Link className="underline text-brand-700" href="/publications" prefetch={false}>
              publications
            </Link>
            .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
