import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="hr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#fafaf9",
          color: "#1c1917",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div style={{ fontSize: "6rem", lineHeight: 1 }}>🥙</div>
          <h1
            style={{
              fontSize: "5rem",
              fontWeight: 800,
              margin: "0.5rem 0 0",
              letterSpacing: "-0.025em",
              color: "#292524",
            }}
          >
            404
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              color: "#78716c",
              margin: "0.5rem 0 0",
              maxWidth: "24rem",
            }}
          >
            Uh oh, ovu stranicu smo pojeli.
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "#a8a29e",
              margin: "0.25rem 0 1.5rem",
            }}
          >
            Looks like this page got eaten.
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "#1c1917",
              color: "#fff",
              borderRadius: "0.75rem",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              transition: "background 0.2s",
            }}
          >
            Vrati se na početnu
          </Link>
        </div>
      </body>
    </html>
  );
}

