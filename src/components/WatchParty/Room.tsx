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
type JoinRoomProps = {
  roomType: "Join" | "Create";
};

const Room = ({ roomType }: JoinRoomProps) => {
  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-lg bg-[#ebecff] flex flex-col">
      <CardHeader className="flex flex-col items-center space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-400 shadow-lg">
          <LuClapperboard className="text-4xl text-white" />
        </div>

        <CardTitle className="text-2xl font-semibold">
          {roomType} Room
        </CardTitle>
      </CardHeader>
      <CardContent>
        {roomType === "Create" ? (
          <Input
            placeholder="Enter room name"
            className="w-full bg-white  py-6 rounded-xl text-xl font-medium"
          />
        ) : (
          <InputOTP maxLength={4}>
            <InputOTPGroup className="flex justify-center mx-auto gap-4">
              <InputOTPSlot index={0} className="bg-white p-6 rounded-md" />
              <InputOTPSlot index={1} className="bg-white p-6 rounded-md" />
              <InputOTPSlot index={2} className="bg-white p-6 rounded-md" />
              <InputOTPSlot index={3} className="bg-white p-6 rounded-md" />
            </InputOTPGroup>
          </InputOTP>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-blue-500 text-white text-xl font-semibold !p-6 rounded-xl hover:bg-blue-600 transition-colors ">
          Join Room
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Room;
