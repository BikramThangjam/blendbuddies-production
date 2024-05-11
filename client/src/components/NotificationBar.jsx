
import Snackbar from "@mui/material/Snackbar";
import Fade from "@mui/material/Fade";
import Alert from "@mui/material/Alert";
import { closeNotification } from "../reducers";
import { useDispatch, useSelector } from "react-redux";

export default function NotificationBar() {
  // Notification bar state
  const open = useSelector((state) => state.notification);
  const msg = useSelector(state => state.notifMsg);
  

  const dispatch = useDispatch();

  const handleNotificationClose = () => {
    dispatch(closeNotification());
  };

  return (
    <>
      {/* Snackbar for notification */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={open}
        autoHideDuration={3000} // Adjust the duration as needed
        onClose={handleNotificationClose}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={handleNotificationClose}
          severity={msg === "removed" ? "warning" : "success"}
          sx={{ width: "100%" }}
        >
          {msg === "removed"
            ? "Removed from friend list"
            : "Added to friend list"}
        </Alert>
      </Snackbar>
    </>
  );
}
