// src/app/privacy/page.tsx
import HeaderBanner from "@/components/HeaderBanner";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for the Operator Learning & Scientific Computing Lab at the University of Utah.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <HeaderBanner
        title="Privacy Policy"
        subtitle="How we collect, use, and protect information on this site."
        imgSrc="/hero/privacy.png"
        variant="background"
      />

      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        <p className="text-sm text-gray-600">Last updated: November 2025</p>

        <section className="card-nb">
          <h2 className="section-title">1. Introduction</h2>
          <p className="mt-2">
            This website is operated by the Operator Learning & Scientific Computing Lab at the
            University of Utah. We aim to be transparent about what information we collect and how
            it is used. By using this website, you agree to the practices described below.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">2. Information We Collect</h2>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>
              <span className="font-semibold">Basic website analytics</span> (via server logs or our
              hosting provider), which may include browser type/version, IP address (anonymized
              where possible), pages visited, time spent, and referring site.
            </li>
            <li>
              <span className="font-semibold">Contact information</span> only if you email us or
              submit information voluntarily (e.g., your name, email, academic affiliation).
            </li>
          </ul>
          <p className="mt-2">
            We do <span className="font-semibold">not</span> use cookies for advertising or
            profiling.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">3. How We Use Information</h2>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>Improve website performance, content, and security.</li>
            <li>
              Respond to inquiries, discuss research opportunities or collaborations, and communicate
              about lab activities (only if you opt in).
            </li>
          </ul>
          <p className="mt-2">We do not sell, rent, or trade personal information.</p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">4. Data Sharing</h2>
          <p className="mt-2">
            We may share limited information with University of Utah service providers for analytics
            and security, or with collaborators <em>only with your permission</em>. We may also
            disclose information when required by law.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">5. External Links</h2>
          <p className="mt-2">
            Our site links to external websites (e.g., arXiv, journals, GitHub, personal academic
            pages). Their privacy practices apply once you leave our domain.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">6. Data Security</h2>
          <p className="mt-2">
            We use reasonable administrative and technical measures to protect information. No
            internet transmission is completely secure, but we follow common academic web practices.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">7. Children’s Privacy</h2>
          <p className="mt-2">
            This site is not directed to children under 13, and we do not knowingly collect
            information from minors without consent.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">8. Changes to This Policy</h2>
          <p className="mt-2">
            We may update this policy periodically. The “Last updated” date will reflect revisions.
          </p>
        </section>

        <section className="card-nb">
          <h2 className="section-title">9. Contact</h2>
          <p className="mt-2">
            Questions? Contact us at{" "}
            <a
              className="link"
              href="mailto:varun.shankar@utah.edu?subject=Privacy%20Policy%20Inquiry"
            >
              varun.shankar@utah.edu
            </a>
            .
          </p>
        </section>
      </div>
    </>
  );
}
