export default function PrivacyPolicy() {
  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        color: "#000",           // <-- forces black text
        minHeight: "100vh",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ color: "#1976d2" }}>Privacy Policy</h1>
      <p>
        Welcome to <strong>TestifyAI</strong>. This Privacy Policy explains how
        we collect, use, and protect your information when you use our website
        (thetestifyai.com).
      </p>
      <h2>1. Information We Collect</h2>
      <p>
        We may collect usage data, cookies, and analytics information to improve
        your experience. We do not collect personally identifiable information
        unless voluntarily provided.
      </p>
      <h2>2. How We Use Information</h2>
      <p>
        Information collected is used to enhance site functionality, improve our
        AI systems, and show relevant ads through third-party partners like
        Ezoic or Google.
      </p>
      <h2>3. Third-Party Services</h2>
      <p>
        We use third-party ad networks and analytics tools that may use cookies
        or tracking pixels to deliver better ad experiences.
      </p>
      <h2>4. Your Rights</h2>
      <p>
        You can contact us at{" "}
        <a href="mailto:thetestifyai@gmail.com">thetestifyai@gmail.com</a> for
        questions about your data or to request deletion.
      </p>
      <h2>5. Updates</h2>
      <p>
        This Privacy Policy may be updated periodically. Please review it
        regularly for changes.
      </p>
      <p style={{ marginTop: "40px", fontSize: "0.9rem", color: "#555" }}>
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
