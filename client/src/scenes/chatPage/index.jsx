import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  InputBase,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Skeleton,
  Divider,
  CircularProgress,
} from "@mui/material";

import { Search, ChatOutlined } from "@mui/icons-material";
import Navbar from "../navbar";
import FlexBetween from "../../components/FlexBetween";
import Conversation from "../../components/Conversation";
import { useDispatch, useSelector } from "react-redux";
import MessageContainer from "../../components/MessageContainer";
import { API_URL } from "../../config";
import { setConversations, setSelectedConversation } from "../../reducers";
import { useSocket } from "../../context/SocketContext";

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const alt = theme.palette.background.alt;
  const medium = theme.palette.neutral.medium;

  const loggedInUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const conversations = useSelector((state) => state.conversations);
  const [loadingConversation, setLoadingConversation] = useState(true);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );

  const dispatch = useDispatch();

  const getConversations = async () => {
    try {
      const res = await fetch(`${API_URL}/messages/conversations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error ", data.error);
        return;
      }

      dispatch(setConversations({ conversations: data }));
    } catch (error) {
      console.log("error :: ", error);
    } finally {
      setLoadingConversation(false);
    }
  };

  // Search
  const [searchText, setSearchText] = useState("");
  const [searchingUser, setSearchingUser] = useState(false);

  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);
    try {
      const res = await fetch(`${API_URL}/users/search?searchText=${searchText}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const searchedUser = await res.json();

      if (searchedUser.error) {
        console.log("Error ", searchedUser.error);
        return;
      }

      const messageYourself = searchedUser._id === loggedInUser._id
      if(messageYourself) {
        alert("You cannot message yourself! ");
        return;
      }

      // if user is already in a conversation with the searched user
      const conversationAlreadyExist =  conversations.find((conversation) =>conversation.participants[0]._id === searchedUser._id)
      if (conversationAlreadyExist) {
        dispatch(
          setSelectedConversation({
            selectedConversation: {
              _id: conversationAlreadyExist._id,
              userId: searchedUser._id,
              username: `${searchedUser.firstName} ${searchedUser.lastName}`,
              userProfilePic: searchedUser.picturePath,
            },
          })
        );
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            firstName:searchedUser.firstName,
            lastName:searchedUser.lastName,
            picturePath:searchedUser.picturePath,
          }
        ]
      }

      dispatch(setConversations({
        conversations: [...conversations,mockConversation]
      }))

    } catch (error) {
      console.log(error);
    }finally{
       setSearchingUser(false);
    }
  };

  // socket
  const {socket, onlineUsers} = useSocket();

  // For seem messages
  useEffect(()=>{
    socket?.on("messagesSeen", ({conversationId})=>{
      const updatedConversations = conversations.map(conversation => {
        if(conversation._id === conversationId){
          return {
            ...conversation,
            lastMessage: {
              ...conversation.lastMessage,
              seen: true
            }
          }
        }

        return conversation
      })

      dispatch(setConversations({conversations: updatedConversations}))
    })
  },[socket, conversations])

  useEffect(() => {
    getConversations();
  }, []);

  useEffect(()=>{
    if(socket){
      socket.on("newMessage", (message)=>{
        getConversations();
      })
      return ()=> socket.off("newMessage");
    }
  },[socket, conversations])

  return (
    <Box bgcolor={neutralLight} sx={{ width: "100vw", height: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg">
        <Box
          sx={{
            paddingTop: "2rem",
            display: "flex",
            flexDirection: isNonMobileScreens ? "row" : "column",
            height: "80vh",
          }}
        >
          <Box
            flexBasis={"30%"}
            bgcolor={alt}
            borderRadius={"10px 0 0 10px"}
            padding={"1.2rem"}
          >
            <Typography
              paddingBottom={"0.8rem"}
              variant="h4"
              fontWeight={500}
              color={dark}
              fontSize="1.2rem"
              textAlign="center"
            >
              Your Conversations
            </Typography>
            <form
              onSubmit={handleConversationSearch}
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.2rem",
              }}
            >
              <FlexBetween
                backgroundColor={neutralLight}
                borderRadius="9px"
                width={"80%"}
                padding={"0px 1.5rem"}
              >
                <InputBase
                  placeholder="Search for a user..."
                  onChange={(e) => setSearchText(e.target.value)}
                />
                {searchingUser ? (
                  <CircularProgress size={15} color="secondary"/>
                ) : (
                  <IconButton onClick={handleConversationSearch}>
                    <Search />
                  </IconButton>
                )}
              </FlexBetween>
            </form>
            {loadingConversation &&
              [0, 1, 2, 3, 4].map((_, i) => (
                <Box
                  key={i}
                  display={"flex"}
                  gap={3}
                  width={"95%"}
                  margin={"1.2rem 0"}
                >
                  <Skeleton
                    animation="wave"
                    variant="circular"
                    width={40}
                    height={32}
                  />
                  <Box display={"flex"} flexDirection={"column"} width="100%">
                    {" "}
                    {/* Ensure the width is set to 100% */}
                    <Skeleton
                      animation="wave"
                      width="40%"
                      height={15}
                      style={{ marginBottom: 6 }}
                    />
                    <Skeleton animation="wave" height={15} width="80%" />
                  </Box>
                </Box>
              ))}

            {!loadingConversation &&
              conversations.map((conversation) => (
                <Conversation
                  key={conversation._id}
                  isOnline = {onlineUsers.includes(conversation.participants[0]._id)}
                  conversation={conversation}
                />
              ))}
          </Box>
          <Divider
            orientation={isNonMobileScreens ? "vertical" : "horizontal"}
          />
          {!selectedConversation._id && (
            <Box flexBasis={"70%"} bgcolor={alt} position="relative">
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                padding="3rem 0"
                sx={{
                  position: "absolute",
                  left: "50%",
                  transform: "translate(-50%, 50%)",
                }}
              >
                <Typography>
                  <IconButton>
                    <ChatOutlined style={{ fontSize: "4rem" }} />
                  </IconButton>
                </Typography>
                <Typography>
                  Select a conversation to start messaging
                </Typography>
              </Box>
            </Box>
          )}

          {selectedConversation._id && <MessageContainer />}
        </Box>
      </Container>
    </Box>
  );
};

export default ChatPage;
