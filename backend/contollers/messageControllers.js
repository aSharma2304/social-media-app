import prisma from "../prisma/prismaClient.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  const userId = req.user.id;
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res
        .status(400)
        .json({ status: 400, message: "ReceiverId and message is required" });
    }

    const receiver = await prisma.user.findFirst({
      where: {
        id: receiverId,
      },
    });
    if (!receiver) {
      return res
        .status(400)
        .json({ status: 400, message: "Not a valid user to send message to " });
    }

    const sortedUserIds = [userId, receiverId].sort();

    let conversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            id: { in: sortedUserIds },
          },
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          participants: {
            connect: sortedUserIds.map((id) => ({ id })),
          },
        },
        include: {
          participants: true,
        },
      });
    }

    const newMessage = await prisma.message.create({
      data: {
        conversationId: conversation.id,
        userId: userId,
        text: message,
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageId: newMessage.id },
    });

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json({
      status: 200,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while sending message ",
      error: err,
    });
  }
};

// export const getMessages = async (req, res) => {
//   const userId = req.user.id;
//   try {
//     const { otherUserId } = req.params;
//     const sortedUserIds = [userId, otherUserId].sort();
//     const conversation = await prisma.conversation.findFirst({
//       where: {
//         participants: {
//           every: {
//             id: { in: sortedUserIds },
//           },
//         },
//       },
//       include: {
//         participants: true,
//       },
//     });

//     if (!conversation) {
//       return res.status(200).json({
//         status: 200,
//         message: "No conversation found in getMessages route",
//         conversations: [],
//       });
//     }

//     const messages = await prisma.message.findMany({
//       where: {
//         conversationId: conversation.id,
//       },
//       orderBy: { createdAt: "asc" },
//     });

//     return res
//       .status(200)
//       .json({ status: 200, message: "Got chat history", messages: messages });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({
//       status: 500,
//       message: "Something went wrong while fetching messages of chat",
//     });
//   }
// };

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    // Find the conversation to ensure it exists
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });

    if (!conversation) {
      return res.status(200).json({
        status: 200,
        message: "No conversation found",
        messages: [],
      });
    }

    // Fetch messages for the given conversation ID
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
    });

    return res.status(200).json({
      status: 200,
      message: "Got chat history",
      messages,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching messages",
    });
  }
};

export const getConversations = async (req, res) => {
  const userId = req.user.id;

  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId },
        },
      },
      include: {
        participants: {
          select: { id: true, username: true, fullname: true, avatar: true },
        },
        lastMessage: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      status: 200,
      message: "Fetched user's conversations",
      conversations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: 500,
      message: "Something went wrong while fetching conversations",
      error: err.message,
    });
  }
};
