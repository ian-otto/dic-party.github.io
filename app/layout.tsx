import "./globals.css";

export const metadata = {
  title: "DiC Board Suite",
  description: "Access for a chosen few",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
