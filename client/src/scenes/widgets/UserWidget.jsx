import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../config";
import EditableText from "../../components/EditableText";
import { openModal } from "../../reducers";

const UserWidget = ({ userId, picturePath}) => {
  const [user, setUser] = useState(null);
  const loggedInUserId = useSelector(state => state.user._id);
  const loggedInFriends = useSelector(state => state.user.friends);

  const { palette } = useTheme();
  const navigate = useNavigate();
  const currentRoute = useLocation();


  const token = useSelector(state => state.token);
  const dispatch = useDispatch()

  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if(response.ok){
      const data = await response.json();
      setUser(data);    
    }
    
  };

  useEffect(() => {

    getUser();

  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
  } = user;

  return (
    <WidgetWrapper>
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
      >
        {/* 1st row */}
        <FlexBetween 
            gap="1rem" 
            onClick={() => navigate(`/profile/${userId}`)}
            sx={{
                "&:hover": {
                  cursor: "pointer",
                },
              }}
        >
          <UserImage image={picturePath}  />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>

            {
              userId === loggedInUserId ? (
                <Typography color={medium}>{loggedInFriends.length} friends</Typography>
              ) : (
                <Typography color={medium}>{friends.length} friends</Typography>
              )
            }
            
          </Box>
        </FlexBetween>
        {
          currentRoute.pathname !== "/home" && user._id == loggedInUserId && (
            <ManageAccountsOutlined 
              onClick={() => dispatch(openModal())} 
              sx={{ "&:hover": { cursor: "pointer" } }}
            />
          )
        }
        
      </FlexBetween>

      <Divider />

      {/* 2nd row */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* 3rd row */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* 4th row */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>

        <EditableText text={user?.socialProfileUrl.linkedin} socialPlatform="linkedin" userId={userId} loggedInUserId = {loggedInUserId} getUser={getUser}/>
        <EditableText text={user?.socialProfileUrl.twitter} socialPlatform="twitter" userId={userId} loggedInUserId = {loggedInUserId} getUser={getUser} />     

      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
