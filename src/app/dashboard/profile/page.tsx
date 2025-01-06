import { Separator } from "@radix-ui/react-separator";
import React from "react";
import { ProfileForm } from "./profile-form";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
const ProfilePage = async () => {
  await connectDB();

  // Obtener email del usuario autenticado desde sesión o middleware
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return <p>Please log in</p>;
  }

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return <p>User not found</p>;
  }
  return (
    <div className="space-y-6">
      <div className="m-5">
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </div>
      <Separator />
      <div className="m-10">
        <ProfileForm
          user={{
            email: user.email,
            fullname: user.fullname || "",
            country: user.country || "",
            state: user.state || "",
            locality: user.locality || "",
            avatar: user.image || "/default-avatar.png",
            whatsapp: user.whatsapp || "",
            address: user.address || "",
            postalcode: user.postalcode || "",
          }}
        />
      </div>
    </div>
  );
};

export default ProfilePage;

/* 

import React from "react";
import { ProfileForm } from "./profile-form";
import { Separator } from "@radix-ui/react-separator";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/user";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const ProfilePage = async () => {
  await connectDB();

  // Obtener email del usuario autenticado desde sesión o middleware
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;

  if (!userEmail) {
    return <p>Please log in</p>;
  }

  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Profile</h3>
      <ProfileForm
        user={{
          email: user.email,
          username: user.username || "",
          country: user.country || "",
          state: user.state || "",
          locality: user.locality || "",
          avatar: user.image || "/default-avatar.png",
        }}
      />
    </div>
  );
};

export default ProfilePage;

*/
