
import React from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import {
  Box,
  Icon,
  IconButton,
  Typography,
  useTheme,
  
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { setFriends, showNotification, setNotifMsg } from "../reducers";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { API_URL } from "../config";

function Friend({
  friendId,
  name,
  subtitle,
  userPicturePath,
  getFriendSuggestions,
  profileId
}) {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const location = useLocation();
  // const isProfileRoute = location.pathname.includes("/profile/");
  const isHomeRoute = location.pathname.includes("/home");
 

  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);
  

 

  const patchFriend = async () => {
    const response = await fetch(`${API_URL}/users/${_id}/${friendId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
       
      const data = await response.json();
      
      dispatch(setFriends({ friends: data.formattedFriends }));
      getFriendSuggestions();
      dispatch(setNotifMsg({msg: data.msg}));
      dispatch(showNotification()); // Open the notification bar
      
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem" onClick={() => navigate(`/profile/${friendId}`)} style={{cursor: "pointer"}}>
        <UserImage image={userPicturePath} size="55px" />
        <Link to={`/profile/${friendId}`} style={{ textDecoration: "none" }}>
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
        </Link>
      </FlexBetween>
      {(isHomeRoute || profileId === _id) && (
        <IconButton
          onClick={patchFriend}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}

     
    </FlexBetween>
  );
}

export default Friend;
