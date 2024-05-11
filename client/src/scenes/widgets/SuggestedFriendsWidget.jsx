import { Box, Typography, useTheme } from "@mui/material";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { API_URL } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import SuggestedFriend from "../../components/SuggestedFriend";
import { setSuggestedFriends, setFriends} from "../../reducers";

const SuggestedFriendsWidget = () => {
  const token = useSelector(state => state.token);
  const suggestedFriends = useSelector(state => state.suggestedFriends);
  const loggedInUserId = useSelector(state => state.user._id);
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const getFriendSuggestions = async () => {
    const response = await fetch(`${API_URL}/users/${loggedInUserId}/suggestions`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (response.ok) {
      const data = await response.json();
      dispatch(setSuggestedFriends({ suggestedFriends: data }));
    }
  };
  

  useEffect(() => {
    getFriendSuggestions();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper 
        sx={{
            overflowY: "auto",
            maxHeight: "350px", // Adjust the max height as needed
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
        Friend Suggestions
      </Typography>
      <Typography my="1.5rem" color="primary" variant="h5">People you may know</Typography>
      {suggestedFriends?.length > 0 ? (
        <Box display="flex" flexDirection="column" gap="1.5rem">
          {suggestedFriends.map((friend) => (
            <SuggestedFriend
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
        <Typography fontSize="0.7rem">No friend suggestions to show</Typography>
      )}
    </WidgetWrapper>
  );
};

export default SuggestedFriendsWidget;
