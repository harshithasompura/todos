import type { Metadata } from "next";
import { Annie_Use_Your_Telescope } from "next/font/google";
import "./globals.css";

const annie = Annie_Use_Your_Telescope({
  variable: "--font-annie",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Todos",
  description: "A log of days.",
};

const themeInit = `(function(){try{var t=localStorage.getItem('orbit:theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning className={`${annie.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="text-zinc-900 dark:text-zinc-100">{children}</body>
    </html>
  );
}
