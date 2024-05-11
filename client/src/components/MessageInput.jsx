import React, { useState, useRef, useEffect } from "react";
import FlexBetween from "./FlexBetween";
import {
  InputBase,
  IconButton,
  useTheme,
  Box,
  Modal,
  CircularProgress,
} from "@mui/material";
import { SendOutlined, Close, Height } from "@mui/icons-material";
import ImageIcon from "@mui/icons-material/Image";
import SendIcon from "@mui/icons-material/Send";
import { API_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { setConversations, setSelectedConversation } from "../reducers";

const MessageInput = ({ setMessages }) => {
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const token = useSelector((state) => state.token);
  const conversations = useSelector((state) => state.conversations);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );

  const [text, setText] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [img, setImg] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();

  const imageRef = useRef(null);

  const handleChangeImg = (e) => {
    const {files} = e.target;
    if(files){
      setImg(files[0])
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !img) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("recipientId", selectedConversation.userId);
      formData.append("message", text || imgCaption);
      if (img) {
        formData.append("image", img);
      }

      const res = await fetch(`${API_URL}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();

      setMessages((prevMessages) => [...prevMessages, data]);

      const updatedConversations = conversations.map((conversation) => {
        if (conversation._id === selectedConversation._id) {
          return {
            ...conversation,
            _id: data.conversationId,
            mock: false,
            lastMessage: {
              text,
              sender: data.sender,
            },
          };
        }
        return conversation;
      });

      dispatch(
        setConversations({
          conversations: updatedConversations,
        })
      );

      dispatch(
        setSelectedConversation({
          selectedConversation: {
            ...selectedConversation,
            _id: data.conversationId,
          },
        })
      );

      setText("");
      setImgCaption("");
      if(img){
        console.log("img existed and setting it to null.")
        setImg(null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    padding: "3.5rem 0 0 0",
  };

  return (
    <Box>
      <form onSubmit={handleSendMessage}>
        <Box display="flex" gap={2} alignItems="center">
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            padding={"0.6rem  1.5rem"}
            flex="95%"
          >
            <InputBase
              placeholder="Write a message here..."
              fullWidth
              sx={{ fontSize: "1.2rem" }}
              name="message"
              value={text}
              onChange={(e)=>setText(e.target.value)}
            />
            <IconButton onClick={handleSendMessage}>
              <SendOutlined />
            </IconButton>
          </FlexBetween>

          <Box display="flex" alignItems="center">
            <ImageIcon
              onClick={() => imageRef.current.click()}
              sx={{ cursor: "pointer", fontSize:"2rem"}}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              hidden
              ref={imageRef}
              onChange={handleChangeImg}
            />
          </Box>
        </Box>
      </form>
      <Modal
        open={img ? true : false}
        onClose={() => {
          setImg("");   
        }}
      >
        <Box
          sx={style}
          position="relative"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <IconButton
            sx={{ position: "absolute", top: "5px", right: "10px" }}
            onClick={() => {
              setImg("")
            }}
          >
            <Close sx={{ fontSize: "2rem" }} />
          </IconButton>
          {
            img && (
              <img
              src={URL.createObjectURL(img)}
              alt="Preview"
              width="100%"
              height="500px"
              style={{ objectFit: "cover" }}
            />
            )
          }
         
          <Box display="flex" justifyContent="space-between" width="100%" padding="1.2rem">
            <InputBase
                placeholder="Write a message here..."
                fullWidth
                sx={{ fontSize: "1.2rem" }}
                name="message"
                value={imgCaption}
                onChange={(e)=>setImgCaption(e.target.value)}
              />
            {!isSending ? (
              <IconButton onClick={handleSendMessage}>
                <SendIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            ) : (
              <CircularProgress color="secondary" />
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MessageInput;
