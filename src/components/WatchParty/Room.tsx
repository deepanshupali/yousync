"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LuClapperboard } from "react-icons/lu";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

type JoinRoomProps = {
  roomType: "Join" | "Create";
};

const Room = ({ roomType }: JoinRoomProps) => {
  const [roomName, setRoomName] = React.useState("");
  const [roomId, setRoomId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  async function handleClick() {
    if (loading) return; // prevent double clicks
    setLoading(true);

    const isCreate = roomType === "Create";
    const endpoint = isCreate ? "/api/rooms" : "/api/rooms/join";
    const payload = isCreate ? { title: roomName } : { roomId };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/watchparty/${isCreate ? data.id : data.roomId}`);
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Network error or server not responding");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg bg-white dark:bg-neutral-900 flex flex-col border border-neutral-200 dark:border-neutral-800">
      <CardHeader className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-400 shadow-lg">
          <LuClapperboard className="text-4xl text-white" />
        </div>

        <CardTitle className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          {roomType} Room
        </CardTitle>
      </CardHeader>

      <CardContent>
        {roomType === "Create" ? (
          <Input
            placeholder="Enter room name"
            className="w-full bg-white dark:bg-neutral-800 py-6 rounded-xl text-xl font-medium text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        ) : (
          <InputOTP maxLength={4} value={roomId} onChange={(e) => setRoomId(e)}>
            <InputOTPGroup className="flex justify-center mx-auto gap-4">
              {[0, 1, 2, 3].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="bg-white dark:bg-neutral-800 p-6 rounded-md text-neutral-900 dark:text-neutral-100"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className="w-full bg-blue-500 text-white text-xl font-semibold !p-6 rounded-xl hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          onClick={handleClick}
          disabled={loading}
        >
          {loading ? (
            <>
              <ClipLoader color="#ffffff" size={24} />
              <span>Processing...</span>
            </>
          ) : (
            `${roomType} Room`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Room;
