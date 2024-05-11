import {
  Box,
  Typography,
  useMediaQuery,
  Backdrop,
  Modal,
  Fade,
} from "@mui/material";
import EditForm from "./EditForm";


import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../reducers";

const EditProfilePage = () => {
  const isOpen = useSelector((state) => state.isOpen);

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const dispatch = useDispatch();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: isNonMobileScreens ? "30%" : "93%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <Box>
      <Modal
        open={isOpen}
        onClose={() => dispatch(closeModal())}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
          <Box
            sx={modalStyle}
            onClick={(e) => e.stopPropagation()}
          >
            <Typography fontWeight="500" variant="h3" sx={{ mb: "1.5rem" }}>
              Edit Profile
            </Typography>
            <EditForm />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default EditProfilePage;
