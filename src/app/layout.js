export const metadata = {
  title: "AI Notes App",
  description: "Next.js Notes app with AI + Encryption",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#0f172a", color: "#fff" }}>
        {children}
      </body>
    </html>
  );
}
