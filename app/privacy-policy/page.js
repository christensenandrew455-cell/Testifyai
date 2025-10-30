export const metadata = {
  title: "Privacy Policy - TestifyAI",
  description: "Learn how TestifyAI collects and protects your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
        color: "#222",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>Privacy Policy</h1>

      <p>
        At <strong>TestifyAI</strong>, accessible from thetestifyai.com, we value
        your privacy. This Privacy Policy describes how we handle information
        collected through our website and services.
      </p>

      <h2 style={{ marginTop: "30px" }}>1. Information We Collect</h2>
      <p>
        We may collect anonymous usage data to improve our platform. If you
        contact us, we may collect your email address for support or feedback
        purposes.
      </p>

      <h2 style={{ marginTop: "30px" }}>2. How We Use Information</h2>
      <p>
        Data is used only to improve the site’s performance and functionality.
        We do not sell or share your personal data with third parties for
        marketing.
      </p>

      <h2 style={{ marginTop: "30px" }}>3. Cookies & Ads</h2>
      <p>
        We may use cookies and third-party advertising services (like Ezoic and
        Google AdSense) to deliver personalized ads and analyze usage.
      </p>

      <h2 style={{ marginTop: "30px" }}>4. Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:thetestifyai@gmail.com">thetestifyai@gmail.com</a>.
      </p>

      <p style={{ marginTop: "40px", fontSize: "0.9rem", color: "#555" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </main>
  );
}
