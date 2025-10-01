"use client";

import { MembershipWithUser, RoomWithMembers } from "@custom-types/index";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OnlineUsers: React.FC<{
  members: MembershipWithUser[];
  roomInfo: RoomWithMembers;
  currentUserId: string;
  kickUser: (userId: string) => void;
}> = ({ members, roomInfo, currentUserId, kickUser }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Online Users ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {members.map((m) => {
          const isAdmin = roomInfo.adminId === m.userId;
          const isCurrent = m.userId === currentUserId;

          return (
            <div
              key={m.id}
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted transition"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={m.user.image ?? ""} />
                  <AvatarFallback>
                    {m.user.name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">
                    {isCurrent ? "You" : m.user.name}
                  </span>
                  <Badge
                    variant={isAdmin ? "default" : "secondary"}
                    className="w-fit text-[10px] px-1.5 py-0.5"
                  >
                    {isAdmin ? "Admin" : m.role}
                  </Badge>
                </div>
              </div>

              {/* Right: Kick button (only if current user is admin & not self) */}
              {roomInfo.adminId === currentUserId && !isCurrent && (
                <Button
                  onClick={() => kickUser(m.userId)}
                  variant="destructive"
                  size="sm"
                  className="cursor-pointer"
                >
                  Kick
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default OnlineUsers;
