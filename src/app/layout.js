import "./globals.css";

export const metadata = {
  title: "Crossposting",
  description: "One Post. All Platforms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
