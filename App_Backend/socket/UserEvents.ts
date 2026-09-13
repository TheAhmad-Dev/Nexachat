import { Server as IOSocketServer, Socket } from "socket.io";
import User from "../models/User.js";
import { generateToken } from "../utils/token.js";

export function RegisterUserEvents(io: IOSocketServer, socket: Socket) {
  // Test Socket
  socket.on("TestSocket", (data) => {
    console.log("Received:", data);

    socket.emit("TestSocket", {
      msg: "User Socket is working ✅",
    });
  });

  // Update Profile
  socket.on(
    "Update Profile",
    async (data: { name?: string; avatar?: string | null }) => {
      console.log("Update Profile Received:", data);

      const userId = socket.data.userId;

      // User not authenticated
      if (!userId) {
        return socket.emit("UpdatedProfile", {
          success: false,
          msg: "Unauthorized Access",
        });
      }

      try {
        // Only update provided fields
        const updateData: any = {};

        if (data.name) {
          updateData.name = data.name;
        }

        if (data.avatar) {
          updateData.avatar = data.avatar;
        }

        const UpdatedUser = await User.findByIdAndUpdate(userId, updateData, {
          new: true,
        });

        // User not found
        if (!UpdatedUser) {
          return socket.emit("UpdatedProfile", {
            success: false,
            msg: "User not found",
          });
        }

        // Generate new token with updated user
        const newToken = generateToken(UpdatedUser);

        // Send response to frontend
        socket.emit("UpdatedProfile", {
          success: true,

          data: {
            token: newToken,
          },

          user: UpdatedUser,

          msg: "Profile Updated Successfully",
        });
      } catch (error) {
        console.log("Error Updating Profile:", error);

        socket.emit("UpdatedProfile", {
          success: false,

          msg: "Error Updating the Profile",
        });
      }
    },
  );
  socket.on("getcontacts", async () => {
    console.log("✅ getcontacts event received");
    try {
      const currentUserId = socket.data.userId;
      if (!currentUserId) {
        socket.emit("getcontacts", {
          success: false,
          msg: "Authentication Failed in getcontacts",
        });
        return;
      }
      const users = await User.find(
        //WIll fatch all the matching users
        { _id: { $ne: currentUserId } },
        { password: 0 }, //password field will be zero
      ).lean(); //

      console.log("Current User:", currentUserId);
      console.log("Users:", users);

      //Mapping All the contacts
      const contacts = users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || " ",
      }));
      //sending Response to the backend
      socket.emit("getcontacts", {
        success: true,
        data: contacts,
      });
    } catch (error: any) {
      console.log("Get Contacts error :  ", error);
      socket.emit("getcontacts", {
        success: false,
        msg: "Failed to fetch  Contacts ",
      });
    }
  });
}
