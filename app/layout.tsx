import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus 2 Career - Student Success Platform",
  description: "AI-Powered Career Intelligence & Student Success Platform",
  icons: {
    icon: "/brand/logo-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900;1000&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5F8FA] text-[#0F1E36] antialiased min-h-screen font-sans">
        {children}
      </body>
    </html>
  );
}
