import { Hero } from "./hero";
import { Calendar } from "./calendar";
import { ThemeToggle } from "./theme-toggle";
import { Footer } from "./footer";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Hero />
      <ThemeToggle />
      <div className="relative z-10">
        <Calendar />
      </div>
      <Footer />
    </main>
  );
}
