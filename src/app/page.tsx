import HeaderBanner from "@/components/HeaderBanner";

export default function HomePage() {
  return (
    <>
      <HeaderBanner
        title="About Us"
        subtitle="Exploring the frontiers of scientific computing and operator learning."
        imgSrc="/hero/homep.jpg"      // optional; shows gradient if missing
        variant="background"
      />
      <section className="mx-auto max-w-6xl px-4 py-10 text-gray-800">
        <p>
          Welcome to our lab. We develop advanced methods in scientific computing, operator learning,
          and machine learning for physical systems. Our work spans DeepONets, PDE solvers, and
          physics-informed neural networks.
        </p>
      </section>
    </>
  );
}
