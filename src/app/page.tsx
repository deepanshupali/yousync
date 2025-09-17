import Hero from "@/components/Hero/Hero";
import Nav from "@/components/Nav/Nav";

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300 flex flex-col gap-24">
      <Nav />
      <Hero />
    </main>
  );
}
