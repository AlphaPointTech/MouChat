import localFont from "next/font/local";
import "./globals.css";
import Header from "@/Components/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Myopia",
  description: "Myopia Diagnostic App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Header/>

        <script src="//cdn.amcharts.com/lib/5/index.js"></script>
        <script src="//cdn.amcharts.com/lib/5/map.js"></script>
        <script src="//cdn.amcharts.com/lib/5/geodata/worldLow.js"></script>
        <script src="//cdn.amcharts.com/lib/5/themes/Animated.js"></script>
        {children}
      </body>
    </html>
  );
}
