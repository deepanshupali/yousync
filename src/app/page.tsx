import Hero from "@/components/Hero/Hero";
import Nav from "@/components/Nav/Nav";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-gray-950 dark:via-gray-900 dark:to-neutral-950 text-black dark:text-white transition-colors duration-500 flex flex-col overflow-hidden">
      {/* Navigation */}
      <Nav />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center relative">
        {/* Subtle glowing background accents */}
        <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />

        <Hero />
      </section>
    </main>
  );
}
