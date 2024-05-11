import { Box, TextField, IconButton } from "@mui/material";
import { SendOutlined } from "@mui/icons-material";
import UserImage from "../../components/UserImage";
import { Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { API_URL } from "../../config";

const CommentWidget = ({ userId, postId, from, getComments}) => {
  const token = useSelector(state => state.token);
  const user = useSelector(state => state.user)

  const commentSchema = Yup.object().shape({
    comment: Yup.string().required("comment cannot be empty"),
  });

  const initialComment = {
    comment: "",
  };

  const registerComment = async (values, onSubmitProps) => {
    
    const formData = {
      userId,
      postId,
      from,
      comment: values.comment
    }

    const response = await fetch(
      `${API_URL}/posts/addComment`,
      {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body:  JSON.stringify(formData)
      }
    );

    if (response.status === 201){
        getComments(postId)
    }

    onSubmitProps.resetForm();

  };

  return (
    <Formik
      onSubmit={registerComment}
      initialValues={initialComment}
      validationSchema={commentSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            pb="5px"
            width="100%"
            sx={{
              display: "flex",
              gap: "1.2rem",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <UserImage image={user.picturePath} size="30px" />
            <TextField
              id="outlined-basic"
              label="Write a comment..."
              variant="standard"
              size="small"
              fullWidth
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.comment}
              name="comment"
              error={
                Boolean(touched.comment) && Boolean(errors.comment)
              }
              helperText={touched.comment && errors.comment}
            />
            <IconButton
              type="submit"
              sx={{cursor: "pointer"}}
            >
              <SendOutlined />
            </IconButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default CommentWidget;
