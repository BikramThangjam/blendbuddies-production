import React, { useState } from "react";
import { TextField, Typography, useTheme, Box } from "@mui/material";
import { EditOutlined, SaveOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { API_URL } from "../config";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../reducers";

const EditableText = ({ text, socialPlatform, userId, loggedInUserId, getUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();

  const { palette } = useTheme();
  const medium = palette.neutral.main;
  const main = palette.neutral.main;

  const handleInputChange = (e) => {
    setEditedText(e.target.value);
  };

  const handleEditStart = () => {
    setIsEditing(true);
  };

  const handleEditEnd = async () => {
    setIsEditing(false);
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          socialPlatform,
          profileUrl: editedText,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update social profile URL: ${response.statusText}`
        );
      }

      // const updatedText = await response.json();
      // dispatch(setUserProfile(updatedText));
      getUser()

    } catch (error) {
      console.error("Error updating social profile URL:", error);
      // Handle error appropriately, e.g., show error message to the user
    }
  };

  return (
   
      <Box 
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          gap: "1rem"
        }}
      
      >
        <img src={`../assets/${socialPlatform}.png`} alt="twitter" />
        <Box width="100%">
          <Typography color={main} fontWeight="500">
            {/* Capitalize first letter of a word */}
            {`${socialPlatform.charAt(0).toUpperCase()}${socialPlatform.slice(
              1
            )}`}
          </Typography>

          <FlexBetween >
            {isEditing ? (
              <TextField
                variant="standard"
                value={editedText}
                onChange={handleInputChange}
                fullWidth
                sx={{paddingRight: "2rem"}}
              />
            ) : (
              <Typography color={medium} fontWeight="500" width="85%" overflow="hidden" sx={{paddingRight: "2rem"}}>
                {text}
              </Typography>
            )}

            {userId === loggedInUserId &&
              (isEditing ? (
                <SaveOutlined 
                  
                  onClick={handleEditEnd}  
                />
              ) : (
                <EditOutlined
                  sx={{alignItems: "flex-end"}}
                  onClick={handleEditStart}
                />
              ))}
          </FlexBetween>
        </Box>
      </Box>
    
  );
};

export default EditableText;
