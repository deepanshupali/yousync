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

  if (!session) {
    redirect("/login");
  }

  function toNameCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  return (
    <main className="relative min-h-screen w-full bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex items-center justify-center px-6 py-12">
      {/* Logout button (top-right corner) */}
      <div className="absolute top-6 right-6">
        <LogoutButton />
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Illustration */}
        <div className="flex justify-center">
          <Image
            src={Rimage}
            alt="Illustration"
            width={550}
            priority
            className="drop-shadow-xl rounded-3xl"
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col items-center md:items-start space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">
              Welcome, {toNameCase(session.user?.name || "User")} 👋
            </h1>
            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
              Start or join a watch party and enjoy movies together with your
              friends.
            </p>
          </div>

          <div className="w-full flex flex-col gap-6">
            <Room roomType="Join" />
            <Room roomType="Create" />
          </div>
          <ActiveRoom />
        </div>
      </div>
    </main>
  );
}
