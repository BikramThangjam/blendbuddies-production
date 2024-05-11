import React, { useState, useEffect } from "react";
import {
  Box,
  Avatar,
  Stack,
  Typography,
  useTheme,
  Badge,
  IconButton,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import ImageIcon from "@mui/icons-material/Image";
import { setSelectedConversation } from "../reducers";

const Conversation = ({ conversation, isOnline }) => {
  const loggedInUser = useSelector((state) => state.user);
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  if (!conversation) return null;

  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;
  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );

  const dispatch = useDispatch();
  const isSelected = conversation._id === selectedConversation._id;

  const handleSelectConversation = () => {
    const selectedConvo = {
      _id: conversation._id,
      userId: user._id,
      username: `${user.firstName} ${user.lastName}`,
      userProfilePic: user.picturePath,
      mock: conversation.mock,
    };

    dispatch(
      setSelectedConversation({
        selectedConversation: selectedConvo,
      })
    );
  };

  return (
    <Box
      display={"flex"}
      gap={3}
      width={"95%"}
      padding={"0.5rem"}
      alignItems="center"
      backgroundColor={isSelected ? neutralLight : ""}
      borderRadius="7px"
      sx={{
        cursor: "pointer",
        "&:hover": {
          backgroundColor: neutralLight,
        },
      }}
      onClick={() => handleSelectConversation()}
    >
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        badgeContent={
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              border: "1px solid #CCCCCC",
              backgroundColor: isOnline ? "#09e836" : "#d4d4d4",
            }}
          />
        }
      >
        <Avatar
          alt={`${user.firstName} ${user.lastName}`}
          src={user.picturePath}
          sx={{ width: 45, height: 45 }}
        />
      </Badge>

      <Box display={"flex"} flexDirection={"column"} width="100%">
        <Stack direction="column">
          <Typography variant="h6" width="100%" fontSize="1rem">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography
            variant="body2"
            display="flex"
            alignItems="center"
            gap={"3px"}
          >
            {loggedInUser?._id === lastMessage.sender ? (
              <DoneAllOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  color: lastMessage.seen ? "#07cff7" : "grey",
                }}
              />
            ) : (
              ""
            )}
            {lastMessage.text.length > 18
              ? lastMessage.text.slice(0, 30) + "..."
              : lastMessage.text ||
                (!conversation.mock && <ImageIcon sx={{ fontSize: "2rem" }} />)}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Conversation;
