
import UserWidget from "../widgets/UserWidget";
import Navbar from "../navbar";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import AdvertWidget from "../../scenes/widgets/AdvertWidget";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import EditProfilePage from "../../scenes/editProfilePage";
import SuggestedFriendsWidget from "../../scenes/widgets/SuggestedFriendsWidget";
import NotificationBar from "../../components/NotificationBar";


const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state) => state.user);
  const { _id, picturePath } = user;

  return (
    <Box>
      <NotificationBar />
      <Navbar />
      <EditProfilePage />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "25%" : undefined}>
          <UserWidget userId={_id} picturePath={picturePath} />
          <Box m="2rem 0" />
          <FriendListWidget userId={_id} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "43%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <Box
            sx={{
              overflowY: "auto",
              maxHeight: "calc(100vh + 4rem)", // Adjust the max height as needed
              scrollbarWidth: "none", // Hide scrollbar for Firefox
              "&::-webkit-scrollbar": {
                display: "none", // Hide scrollbar for Webkit-based browsers
              },
            }}
          >
            <PostsWidget userId={_id} />
          </Box>
        </Box>

        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <Box m="2rem 0" />
            <SuggestedFriendsWidget />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
