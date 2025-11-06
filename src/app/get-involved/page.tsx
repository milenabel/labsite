import HeaderBanner from "@/components/HeaderBanner";
import EmailLink from "@/components/EmailLink";

export default function GetInvolvedPage() {
  return (
    <>
      <HeaderBanner
        title="Get Involved"
        subtitle="Join our research group and work on cutting-edge scientific computing and machine learning."
        imgSrc="/hero/get-involved.jpg"  
        variant="background"
      />

      <div className="mx-auto max-w-6xl px-4 py-10 space-y-12">

        {/* Prospective Students */}
        <section>
          <h2 className="text-xl font-semibold text-brand-700">Prospective Students</h2>
          <p className="mt-2 text-gray-700">
            We welcome motivated students interested in scientific computing, numerical methods, PDEs,
            machine learning, and operator learning. Whether you’re exploring undergraduate research,
            an MS thesis, or a PhD, we’d love to hear from you.
          </p>

          <ul className="mt-4 list-disc list-inside text-gray-800 space-y-1">
            <li>Include a brief statement of research interests (1–2 paragraphs).</li>
            <li>Attach a CV/resumé and (optionally) an unofficial transcript.</li>
            <li>Highlight relevant coursework (e.g., numerical methods, ML, PDEs, HPC).</li>
            <li>Share links to code or projects (GitHub/portfolio) if available.</li>
          </ul>

          <EmailLink 
            email="varun.shankar@utah.edu" 
            subject="Prospective Student Inquiry"
            prefer="gmail"
            >
            <span className="btn btn-primary">Email Prof. Shankar</span>
          </EmailLink>
        </section>

        {/* Undergraduate Research */}
        <section>
          <h2 className="text-xl font-semibold text-brand-700">Undergraduate Research</h2>
          <p className="mt-2 text-gray-700">
            Opportunities are available for University of Utah undergraduates interested in applied math,
            scientific computing, or machine learning. Prior research experience isn’t required—curiosity,
            a strong work ethic, and willingness to learn are what matter most.
          </p>
          <p className="mt-3 text-gray-700">
            If you’re interested, please reach out with your schedule/availability and a short note about what
            you’d like to learn or build this semester.
          </p>
          <EmailLink
            email="varun.shankar@utah.edu"
            subject="Undergraduate Research Inquiry"
            prefer="gmail"
          >
            <span className="btn btn-primary">Email about Undergraduate Research</span>
          </EmailLink>
        </section>

        {/* Visiting Researchers / Collaborations */}
        <section>
          <h2 className="text-xl font-semibold text-brand-700">Visiting Researchers & Collaborations</h2>
          <p className="mt-2 text-gray-700">
            We collaborate across applied mathematics, computer science, and engineering. If you’re
            interested in joint projects, short visits, or co-advised work, get in touch with a brief
            description of your interests and how our work might intersect.
          </p>
          <EmailLink
            email="varun.shankar@utah.edu"
            subject="Collaboration Inquiry"
            prefer="gmail"
          >
            <span className="btn btn-primary">Email about Collaborations</span>
          </EmailLink>
        </section>

        {/* Values */}
        <section className="border-t pt-8">
          <p className="text-gray-700">
            We value diversity, curiosity, and persistence. We welcome students of all backgrounds who are
            passionate about research and eager to contribute to a supportive, rigorous team.
          </p>
        </section>
      </div>
    </>
  );
}
