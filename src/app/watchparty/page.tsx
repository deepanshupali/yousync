// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Room from "@/components/WatchParty/Room";
import Rimage from "../../../public/illustration.png";
import Image from "next/image";

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
    <div>
      <div>
        <Image width={500} src={Rimage} alt="Illustration" />
      </div>
      <div>
        <Room roomType="Join" />
        <Room roomType="Create" />
        Welcome {toNameCase(session.user?.name || "User")}!
      </div>
    </div>
  );
}
