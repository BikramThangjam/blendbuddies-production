import React, { useState } from "react";
import {
  Avatar,
  Box,
  Typography,
  useTheme,
  IconButton,
  Skeleton,
} from "@mui/material";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import { useSelector } from "react-redux";
import moment from "moment";

const Message = ({ ownMessage, message }) => {
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  const primaryMedium = theme.palette.primary.medium;
  const neutralMain = theme.palette.neutral.main;

  const selectedConversation = useSelector(
    (state) => state.selectedConversation
  );
  const loggedInUser = useSelector((state) => state.user);

  const [imgLoaded, setImgLoaded] = useState(false);

  // format date
  const formatDate = (dateString) => {
    const date = moment(dateString);

    // Get the current date
    const today = moment();

    // Check if the date is today
    if (date.isSame(today, "day")) {
      // If it's today, format the time
      return `Today at ${date.format("h:mmA")}`;
    } else {
      // If it's not today, format the date
      return date.format("D MMM [at] h:mmA");
    }
  };

  const sentOn = formatDate(message.createdAt);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column" }}
      alignSelf={ownMessage ? "flex-end" : "flex-start"}
    >
      <Box display="flex" gap={2} color={alt}>
        {!ownMessage && <Avatar src={selectedConversation?.userProfilePic} />}
        {message.text && !message.img && (
          <Typography
            maxWidth="350px"
            p={1}
            borderRadius="10px"
            backgroundColor={ownMessage ? primaryMedium : neutralMain}
            fontSize="1.1rem"
            display="flex"
            alignItems="center"
            gap={1}
          >
            {message.text}
            {ownMessage && (
              <DoneAllOutlinedIcon
                sx={{ color: message.seen ? "#07cff7" : "white" }}
              />
            )}
          </Typography>
        )}

        {message.img &&
          !message.text &&
          (imgLoaded ? (
            <Box width="200px" display="flex" gap={1}>
              <img
                src={message.img}
                alt="message image"
                width="100%"
                style={{ borderRadius: "10px" }}
              />
              {ownMessage && (
                <DoneAllOutlinedIcon
                  sx={{
                    color: message.seen ? "#07cff7" : "grey",
                    alignSelf: "flex-end",
                  }}
                />
              )}
            </Box>
          ) : (
            <Box display="flex">
              <img
                src={message.img}
                alt="message image"
                width="100%"
                hidden
                onLoad={() => setImgLoaded(true)}
                style={{ borderRadius: "10px" }}
              />
              <Skeleton width="200px" height="250px" />
            </Box>
          ))}

        {message.text && message.img && (
          true ? (
            <Box display="flex" flexDirection="column" gap={1}>
            <Box width="200px">
              <img
                src={message.img}
                alt="message image"
                width="100%"
                style={{ borderRadius: "10px" }}
              />
            </Box>
            <Typography
              maxWidth="350px"
              p={1}
              borderRadius="10px"
              backgroundColor={ownMessage ? primaryMedium : neutralMain}
              fontSize="1.1rem"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gap={1}
            >
              {message.text}
              {ownMessage && (
                <DoneAllOutlinedIcon
                  sx={{
                    color: message.seen ? "#07cff7" : "white",
                  }}
                />
              )}
            </Typography>
          </Box>
          ) : (
            <Box display="flex" flexDirection="column">
              <img
                src={message.img}
                alt="message image"
                width="100%"
                hidden
                onLoad={() => setImgLoaded(true)}
                style={{ borderRadius: "10px" }}
              />
              <Skeleton width="200px" height="300px"/>
            </Box>
          )
        )}

        {ownMessage && <Avatar src={loggedInUser.picturePath} />}
      </Box>
      <Typography color={neutralMain} paddingTop="5px" textAlign="center">
        {sentOn}
      </Typography>
    </Box>
  );
};

export default Message;
