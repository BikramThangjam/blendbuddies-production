import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Avatar,
  Divider,
  Skeleton,
} from "@mui/material";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { API_URL } from "../config";
import { useSelector, useDispatch } from "react-redux";
import { useSocket } from "../context/SocketContext";
import { setConversations } from "../reducers";

const MessageContainer = () => {
  const theme = useTheme();
  const dark = theme.palette.neutral.dark;
  const alt = theme.palette.background.alt;
  const token = useSelector((state) => state.token);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );

  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const loggedInUserId = useSelector((state) => state.user._id);

  const getMessages = async () => {
    setLoadingMessages(true);
    setMessages([]);
    try {
      if (selectedConversation.mock) return;

      const res = await fetch(
        `${API_URL}/messages/${selectedConversation.userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();
      if (data.error) {
        console.log("error :: ", data.error);
        return;
      }

      setMessages(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // socket
  const { socket } = useSocket();
  const conversations = useSelector((state) => state.conversations);
  const dispatch = useDispatch();

  const messageEndRef = useRef(null);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        if (selectedConversation._id === message.conversationId) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }

        const updatedConversations = conversations.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }

          return conversation;
        });

        dispatch(setConversations({ conversations: updatedConversations }));
      });
      return () => socket.off("newMessage");
    }
  }, [socket, selectedConversation._id, conversations]);

  useEffect(() => {
    if (socket) {
      const lastMessageIsFromOtherUser =
        messages.length &&
        messages[messages.length - 1].sender !== loggedInUserId;
      if (lastMessageIsFromOtherUser) {
        socket.emit("markMessagesAsSeen", {
          conversationId: selectedConversation._id,
          userId: selectedConversation.userId,
        });
      }

      socket.on("messagesSeen", ({ conversationId }) => {
        if (selectedConversation._id === conversationId) {
          setMessages((prev) => {
            const updatedMessages = prev.map((message) => {
              if (!message.seen) {
                return {
                  ...message,
                  seen: true,
                };
              }
              return message;
            });

            return updatedMessages;
          });
        }
      });
    }
  }, [socket, selectedConversation, loggedInUserId, messages]);

  useEffect(() => {
    getMessages();
  }, [selectedConversation.userId, selectedConversation.mock]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box
      flexBasis={"70%"}
      sx={{ height: "100%" }}
      bgcolor={alt}
      p={2}
      borderRadius="0 10px 10px 0"
    >
      <Box
        display="flex"
        height="100%"
        flexDirection="column"
        justifyContent="space-between"
        p="2"
        borderRadius="10px"
      >
        {/* Message header */}
        <Box display="flex" alignItems="center" gap={2} marginBottom="1.2rem">
          <Avatar
            alt="profile_pic"
            src={selectedConversation.userProfilePic}
            sx={{ width: 45, height: 45 }}
          />
          <Typography variant="h6" fontSize="1.2rem">
            {selectedConversation.username}
          </Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            height: "470px",
            overflowY: "scroll",
            marginTop: "1.2rem",
            marginBottom: "1.2rem",
            paddingBottom: "1.2rem",
            "&::-webkit-scrollbar": {
              width: 0,
              height: 0,
            },
          }}
        >
          {loadingMessages &&
            [...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                  gap: 2,
                }}
              >
                {i % 2 === 0 && (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
                <Box display="flex" flexDirection="column" width="30%">
                  <Skeleton animation="wave" width={"100%"} height={15} />
                  <Skeleton animation="wave" width={"100%"} height={15} />
                  <Skeleton animation="wave" width={"100%"} height={15} />
                </Box>
                {i % 2 !== 0 && (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
              </Box>
            ))}

          {!loadingMessages &&
            messages.map((message, index) => (
              <Box
                key={message._id}
                display="flex"
                flexDirection="column"
                ref={index === messages.length - 1 ? messageEndRef : null}
              >
                <Message
                  message={message}
                  ownMessage={loggedInUserId === message.sender}
                />
              </Box>
            ))}
        </Box>
        <MessageInput setMessages={setMessages} />
      </Box>
    </Box>
  );
};

export default MessageContainer;
