import { Card, CardMedia, Grid, useTheme, Modal, Box } from "@mui/material";
import { API_URL } from "../../config";
import { useState } from "react";

const PhotosWidget = ({ posts }) => {
  const theme = useTheme();

  // Modal
  const [open, setOpen] = useState(false);
  const [post, setPost] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid container spacing={2} p="2rem">
        {posts.map(
          (post) =>
            post.picturePath && (
              <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
                <Card
                  sx={{
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 6px rgba(255, 255, 255, 0.4)"
                        : "0 4px 6px rgba(0, 0, 0, 0.4)",
                    "&:hover": {
                      cursor: "pointer"
                    }
                  }}
                  onClick={() => {
                    handleOpen();
                    setPost(post);
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={post.picturePath} // Assuming this is the field containing the picture path
                    alt={post.picturePath}
                  />
                </Card>
              </Grid>
            )
        )}
      </Grid>

      {post && (
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
            <img
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "scale-down",
              }} // Adjust image styles
              src={post.picturePath}
              alt="Preview"
            />
          </Box>
        </Modal>
      )}
    </>
  );
};

export default PhotosWidget;
