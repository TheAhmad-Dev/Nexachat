  import { getSocket } from "./sockets";

  export const TestSockets = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      // remove listener
      socket.off("TestSocket", payload);
    } else if (typeof payload === "function") {
      // listen for response
      socket.on("TestSocket", payload);
    } else {
      // send event to backend
      socket.emit("TestSocket", payload);
    }
  };
  export const UpdatedProfile = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      socket.off("UpdatedProfile", payload);
    } else if (typeof payload === "function") {
      socket.on("UpdatedProfile", payload);
    } else {
      console.log("Sending Update Profile:", payload);

      socket.emit("Update Profile", payload);
    }
  };

  export const getcontacts = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      socket.off("getcontacts", payload);
    } else if (typeof payload === "function") {
      socket.on("getcontacts", payload);
    } else {
      console.log("Sending Update Profile:", payload);

      socket.emit("getcontacts", payload);
    }
    console.log(socket.connected);
  };

  export const newConversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      socket.off("newConversation", payload);
    } else if (typeof payload === "function") {
      socket.on("newConversation", payload);
    } else {
      console.log("Sending New Conversation:", payload);

      socket.emit("newConversation", payload);
    }
    console.log(socket.connected);
  };

  export const getconversation = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      socket.off("getconversation", payload);
    } else if (typeof payload === "function") {
      socket.on("getconversation", payload);
    } else {
      console.log("getconcversation Update :", payload);

      socket.emit("getconversation", payload);
    }
    console.log(socket.connected);
  };

  export const newMessage = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      socket.off("newMessage", payload);
    } else if (typeof payload === "function") {
      socket.on("newMessage", payload);
    } else {
      console.log("new Message concversation Update :", payload);

    socket.emit("newMessage", payload);
    }
    console.log(socket.connected);
  };
  export const getMessages = (payload: any, off: boolean = false) => {
    const socket = getSocket();

    if (!socket) {
      console.log("Socket is not Connected");
      return;
    }

    if (off) {
      socket.off("getMessages", payload);
    } else if (typeof payload === "function") {
      socket.on("getMessages", payload);
    } else {
      console.log("getMessages Update :", payload);

      socket.emit("getMessages", payload);
    }
    console.log(socket.connected);
  };
