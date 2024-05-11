import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";

import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Modal,
  CircularProgress,
} from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts, setSuggestedFriends } from "../../reducers";
import React from "react";
import { API_URL } from "../../config";
import moment from "moment";
import CommentWidget from "./CommentWidget";
import UserImage from "../../components/UserImage";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  // comments,
  createdAt,
}) => {
  const [showAll, setShowAll] = useState(0);
  const [showComments, setShowComments] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const { firstName, lastName } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const postTime = moment(createdAt).fromNow();

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  // Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePatchLike = async () => {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleDeletePost = async () => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
    })

    const updatedPosts = await response.json();
    dispatch(setPosts({posts: updatedPosts}));
  }

  const getComments = async (postId) => {
    setLoading(true)
    const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setComments(data);
      setLoading(false);
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
    getComments(postId);
  }, []);

  return (
    <WidgetWrapper m="2rem">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        getFriendSuggestions={getFriendSuggestions}
      />
      <Typography color={medium} fontSize="0.75rem" mt="1.1rem">
        {postTime}
      </Typography>
      <Typography color={main} sx={{ mt: "1rem"}}>
        {showAll === postId ? description : description.slice(0, 300)}
        {description.length > 300 &&
          (showAll === postId ? (
            <span
              style={{
                color: "#34a2eb",
                cursor: "pointer",
                marginLeft: "0.5rem",
              }}
              onClick={() => setShowAll(0)}
            >
              show less
            </span>
          ) : (
            <span
              style={{
                color: "#34a2eb",
                cursor: "pointer",
                marginLeft: "0.5rem",
              }}
              onClick={() => setShowAll(postId)}
            >
              show more
            </span>
          ))}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          alt="post"
          style={{
            borderRadius: "0.75rem",
            marginTop: "0.75rem",
            maxHeight: "500px",
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={handleOpen}
          src={picturePath}
        />
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "80vw", // Adjust max width to fit the image within the modal
            maxHeight: "80vh", // Adjust max height to fit the image within the modal
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {picturePath && (
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "scale-down",
              }} // Adjust image styles
              src={picturePath}
              alt="Preview"
            />
          )}
        </Box>
      </Modal>

      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          {/* Like */}
          <FlexBetween gap="0.3rem">
            <IconButton onClick={handlePatchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          {/* Comments */}
          <FlexBetween gap="0.3rem">
            <IconButton
              onClick={() => {
                setShowComments(showComments === postId ? null : postId);
              }}
            >
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments?.length}</Typography>
          </FlexBetween>

          {/* Like */}
          <FlexBetween gap="0.3rem">
            {
              postUserId === loggedInUserId && (
                <IconButton onClick={handleDeletePost}>
                  <DeleteOutlineOutlined />
                </IconButton>
              )
            }
          </FlexBetween>

        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* COMMENTS */}

      {showComments === postId && (
        <Box mt="0.5rem">
          <CommentWidget
            userId={loggedInUserId}
            postId={postId}
            from={`${firstName} ${lastName}`}
            getComments={getComments}
          />

          {loading ? (
            <Typography sx={{display: "flex", justifyContent:"center", paddingTop: "2rem"}}>
              <CircularProgress color="secondary" />
            </Typography>
          ) : comments?.length > 0 ? (
            comments?.map((comment, i) => (
              <Box
                key={i}
                pt="1.2rem"
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box display="flex" justifyContent="flex-start" gap="1.2rem">
                  <UserImage
                    image={comment?.userId?.picturePath}
                    size="30px"
                    flexBasis="50px"
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    width="85%"
                  >
                    <Typography
                      color={main}
                      variant="h6"
                      fontWeight="500"
                      sx={{
                        "&:hover": {
                          color: palette.primary.light,
                          cursor: "pointer",
                        },
                      }}
                    >
                      {`${comment?.userId.firstName} ${comment?.userId.lastName}`}
                    </Typography>
                    <Typography>{comment.comment}</Typography>
                  </Box>
                </Box>
                <Typography minWidth="130px">{moment(comment.updatedAt).fromNow()}</Typography>
              </Box>
            ))
          ) : (
            <Typography
              py="1.5rem"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              No comments, be the first to comment
            </Typography>
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
