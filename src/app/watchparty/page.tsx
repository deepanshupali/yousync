// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Room from "@/components/WatchParty/Room";
import Rimage from "../../../public/illustration.png";
import Image from "next/image";
import LogoutButton from "@/components/LogoutBtn";
import ActiveRoom from "@/components/WatchParty/ActiveRooms";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  function toNameCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden text-neutral-900 dark:text-neutral-100 transition-colors duration-700 bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-neutral-950 dark:via-gray-900 dark:to-neutral-950">
      {/* === Glowing Layers (Hero-style + more depth) === */}
      {/* Blue glow (top-left) */}
      <div className="absolute top-[-150px] left-[-180px] w-[500px] h-[500px] bg-blue-400/30 dark:bg-blue-500/25 rounded-full blur-[120px] animate-pulse" />

      {/* Purple glow (bottom-right) */}
      <div className="absolute bottom-[-150px] right-[-180px] w-[500px] h-[500px] bg-purple-500/25 dark:bg-purple-700/25 rounded-full blur-[130px] animate-pulse" />

      {/* Pink accent (center-right) */}
      <div className="absolute top-[35%] right-[25%] w-[280px] h-[280px] bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-[100px] animate-pulse" />

      {/* Blue soft light (center-left) */}
      <div className="absolute top-[50%] left-[15%] w-[300px] h-[300px] bg-sky-300/20 dark:bg-sky-500/15 rounded-full blur-[110px] animate-pulse" />

      {/* Subtle backlight gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-blue-100/10 dark:from-transparent dark:via-neutral-900/20 dark:to-purple-900/20" />

      {/* === Logout button === */}
      <div className="absolute top-6 right-6 z-20">
        <LogoutButton />
      </div>

      {/* === Main Content === */}
      <div className="relative z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center px-6 sm:px-12 md:px-16">
        {/* Left Section */}
        <div className="flex flex-col gap-10 justify-center items-center md:items-start text-center md:text-left">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-snug bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              Welcome, {toNameCase(session.user?.name || "User")} 👋
            </h1>
            <p className="mt-4 text-lg text-neutral-700 dark:text-neutral-400 max-w-md">
              Start or join a watch party, invite your friends, and enjoy your
              favorite shows together — no matter the distance.
            </p>
          </div>

          <Image
            src={Rimage}
            alt="Illustration"
            width={540}
            priority
            className="drop-shadow-[0_15px_40px_rgba(59,130,246,0.3)] rounded-3xl transform hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-start w-full gap-6">
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:mx-0">
            <Room roomType="Join" />
            <Room roomType="Create" />
            <ActiveRoom />
          </div>

          {/* Subtle tip */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 text-center md:text-left italic">
            💡 Pro tip: Share your room ID with friends to sync instantly!
          </p>
        </div>
      </div>
    </main>
  );
}
