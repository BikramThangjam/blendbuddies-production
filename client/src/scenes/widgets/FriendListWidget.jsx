import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSuggestedFriends,
  setFriends,
  setFriendsOfFriends,
} from "../../reducers";
import { API_URL } from "../../config";

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const friends = useSelector((state) => state.user.friends);
  const friendsOfFriends = useSelector((state) => state.user.friendsOfFriends);

  const getFriends = async () => {
    const response = await fetch(`${API_URL}/users/${userId}/friends`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();

      if (userId === loggedInUserId) {
       
        dispatch(setFriends({ friends: data }));
      } else {
        
        dispatch(setFriendsOfFriends({ friendsOfFriends: data }));
      }
    }
  };

  const getFriendSuggestions = async () => {
    const response = await fetch(
      `${API_URL}/users/${loggedInUserId}/suggestions`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.ok) {
      const data = await response.json();
      dispatch(setSuggestedFriends({ suggestedFriends: data }));
    }
  };

  useEffect(() => {
    getFriends();
  }, [userId]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper
      sx={{
        overflowY: "auto",
        maxHeight: "370px", // Adjust the max height as needed
        scrollbarWidth: "none", // Hide scrollbar for Firefox
        "&::-webkit-scrollbar": {
          display: "none", // Hide scrollbar for Webkit-based browsers
        },
      }}
    >
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>

      {userId === loggedInUserId ? (
        friends?.length > 0 ? (
          <Box display="flex" flexDirection="column" gap="1.5rem">
            {friends.map((friend) => (
              <Friend
                key={friend._id}
                friendId={friend._id}
                name={`${friend.firstName} ${friend.lastName}`}
                subtitle={friend.occupation}
                userPicturePath={friend.picturePath}
                getFriendSuggestions={getFriendSuggestions}
                profileId = {userId}
              />
            ))}
          </Box>
        ) : (
          <Typography fontSize="0.7rem">No friends to show</Typography>
        )
      ) : friendsOfFriends?.length > 0 ? (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {friendsOfFriends.map((friend) => (
            <Friend
              key={friend._id}
              friendId={friend._id}
              name={`${friend.firstName} ${friend.lastName}`}
              subtitle={friend.occupation}
              userPicturePath={friend.picturePath}
              getFriendSuggestions={getFriendSuggestions}
            />
          ))}
        </Box>
      ) : (
        <Typography fontSize="0.7rem">No friends to show</Typography>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;
