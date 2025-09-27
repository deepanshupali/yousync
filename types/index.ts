// types/index.ts
export type UserType = {
  id: string;
  name: string | null;
  email: string | null;
  provider: string | null;
  image: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date | null;
};

export type MembershipWithUser = {
  id: string;
  userId: string;
  roomId: string;
  role: string;
  joinedAt: Date;
  user: UserType;
};

export type RoomWithMembers = {
  id: string;
  title: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
  memberships: MembershipWithUser[];
};

export type MessageType = {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  createdAt: Date;
  user: UserType;
};

export type VideoStateType = {
  id: string;
  roomId: string;
  position: number;
  isPlaying: boolean;
  updatedAt: Date;
  updatedBy: string | null;
};
