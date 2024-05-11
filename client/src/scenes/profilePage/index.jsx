import { Box, Typography, useMediaQuery, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../scenes/navbar";
import FriendListWidget from "../../scenes/widgets/FriendListWidget";
import PostsWidget from "../../scenes/widgets/PostsWidget";
import UserWidget from "../../scenes/widgets/UserWidget";
import AdvertWidget from "../../scenes/widgets/AdvertWidget";
import CollectionWidgets from "../../scenes/widgets/CollectionWidgets";
import { API_URL } from "../../config";
import PhotosWidget from "../../scenes/widgets/PhotosWidget";
import EditProfilePage from "../../scenes/editProfilePage";
import SuggestedFriendsWidget from "../../scenes/widgets/SuggestedFriendsWidget";
import NotificationBar from "../../components/NotificationBar";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [showPhotos, setShowPhotos] = useState(false);
  const [loading, setLoading] = useState(false);

  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const posts = useSelector(state => state.posts);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");


  const getUser = async () => {
    setLoading(true)
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if(response.ok){
      const data = await response.json();
      setUser(data);
      setLoading(false)
    }
    
  };

  const getUserPosts = (userId) => {
    // Filter posts by userId
    const userPosts = posts.filter(post => post.userId === userId);    
    return userPosts;
  }

  useEffect(() => {
    getUser();
  }, [userId]); //eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

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
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreens ? "25%" : undefined}>
          <UserWidget userId={userId} picturePath={user.picturePath}/>
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "45%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          p="0 2rem"
        >
          <CollectionWidgets setShowPhotos={setShowPhotos} /> 

          {
            loading ? (
              <Typography sx={{display: "flex", justifyContent:"center", paddingTop: "2rem"}}>
                <CircularProgress color="secondary" />
              </Typography>
            ) : (
              showPhotos ? (
                <PhotosWidget posts={getUserPosts(userId)} />
              ) : (
                <Box
                  sx={{
                    overflowY: "auto",
                    maxHeight: "calc(100vh - 4rem)", // Adjust the max height as needed
                    scrollbarWidth: "none", // Hide scrollbar for Firefox
                    "&::-webkit-scrollbar": {
                    display: "none", // Hide scrollbar for Webkit-based browsers
                    },
                  }}
                >
                  <PostsWidget userId={userId} isProfile />
                </Box>
              )
            )
             
          }
                           
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? "26%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <AdvertWidget></AdvertWidget>
          <Box m="2rem 0" />
          <SuggestedFriendsWidget/>
        </Box>
      </Box>
    </Box>
  );
}

export default ProfilePage;
