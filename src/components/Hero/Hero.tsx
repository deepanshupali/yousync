import Image from "next/image";
import Screenshot from "../../../public/screenshot.png";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex flex-col sm:flex-row items-center justify-between w-full min-h-[90vh] px-6 sm:px-16 lg:px-24 py-12 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-neutral-900 dark:via-gray-900 dark:to-neutral-950 overflow-hidden transition-colors">
      {/* Decorative background blur circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-400/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-400/20 rounded-full blur-3xl" />

      {/* Left content */}
      <div className="relative z-10 flex flex-col sm:basis-[50%] justify-center items-start gap-8 max-w-2xl text-left">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl 2xl:text-7xl font-extrabold leading-tight tracking-tight">
          Stream & Connect
          <br />
          <span className="text-blue-500 block mt-2">With Your Besties 💙</span>
        </h1>

        <p className="text-lg sm:text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed">
          Sync your screens, laugh together, and make memories — even miles
          apart.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          {/* Google Login */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-white border border-neutral-300 dark:bg-neutral-800 dark:border-neutral-700 rounded-xl px-6 py-4 text-base sm:text-lg font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-300 shadow-md"
          >
            <FcGoogle className="text-2xl" />
            Continue with Google
          </Link>

          {/* Guest Trial */}
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-xl px-6 py-4 text-base sm:text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-300"
          >
            <Sparkles className="w-5 h-5" />
            Try for Free 🎉
          </Link>
        </div>

        {/* Subtext */}
        <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
          No account? No problem — jump in instantly or sign in with Google.
        </p>
      </div>

      {/* Right image */}
      <div className="relative z-10 basis-[50%] hidden sm:flex justify-end mt-10 sm:mt-0">
        <Image
          alt="App Screenshot"
          src={Screenshot}
          className="w-[520px] h-auto rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
          priority
        />
      </div>
    </section>
  );
};

export default Hero;
