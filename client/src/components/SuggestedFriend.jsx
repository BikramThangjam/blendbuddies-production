import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box,IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, setNotifMsg, showNotification } from "../reducers";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { API_URL } from "../config";

import React from "react";

function SuggestedFriend({ friendId, name, subtitle, userPicturePath, getFriendSuggestions}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const patchFriend = async () => {
    try {
      const response = await fetch(`${API_URL}/users/${_id}/${friendId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(setFriends({friends: data.formattedFriends }))
        getFriendSuggestions(); // Refresh friend suggestions list after adding friend
        dispatch(setNotifMsg({msg: data.msg}));
        dispatch(showNotification());
      } else {
        // Handle error
        console.error("Failed to add friend:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding friend:", error.message);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${friendId}`)} style={{cursor: "pointer"}} >
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        onClick={patchFriend}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        <PersonAddOutlined sx={{ color: primaryDark }} />
      </IconButton>
    </FlexBetween>
  );
}

export default SuggestedFriend;
