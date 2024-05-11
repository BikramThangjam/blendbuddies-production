import { useState } from "react";

import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as Yup from "yup";

import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";

import { API_URL } from "../../config";
import { useSelector, useDispatch } from "react-redux";
import { closeModal, setLogin } from "../../reducers";

const editProfileSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  location: Yup.string(),
  occupation: Yup.string(),
  picture: Yup.string(),
});

const initialValues = {
  firstName: "",
  lastName: "",
  location: "",
  occupation: "",
  picture: "",
};

const EditForm = () => {
  const userId = useSelector(state => state.user._id)
  const [isSuccess, setIsSuccess] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(null)
  const { palette } = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const token = useSelector(state => state.token);
  const dispatch = useDispatch();

  const updateProfile = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
   

    for (let value in values) {
      formData.append(value, values[value]);
    }
    // formData.append("picturePath", values.picture.name);
    
    const response = await fetch(`${API_URL}/user/profile/${userId}`,{
      method: "PATCH",
      headers: {Authorization: `Bearer ${token}`},
      body: formData,
    })
    onSubmitProps.resetForm();

    if(response.ok){
      const data = await response.json()
      setIsSuccess(true)
      setMsg(data.msg)
      dispatch(
        setLogin({
            user: data.user,
            token
        })
    );
    }
    
    if (response.status === 404) {
      const errorResponse = await loggedInResponse.json();
      setErr(errorResponse.msg)      
      return;
    }

    setTimeout(()=>{
      setIsSuccess(false);
      dispatch(closeModal());
    }, 2500)

  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    updateProfile(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      validationSchema={editProfileSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": {
                gridColumn: isNonMobile ? undefined : "span 4",
              },
            }}
          >
            <>
              <TextField
                label="First Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="firstName"
                error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                label="Last Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />

              <TextField
                label="Location"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.location}
                name="location"
                error={Boolean(touched.location) && Boolean(errors.location)}
                helperText={touched.location && errors.location}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                label="Occupation"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.occupation}
                name="occupation"
                error={
                  Boolean(touched.occupation) && Boolean(errors.occupation)
                }
                helperText={touched.occupation && errors.occupation}
                sx={{ gridColumn: "span 4" }}
              />

              {/*  Picture upload field */}
              <Box
                gridColumn="span 4"
                border={`1px solid ${palette.neutral.medium}`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) =>
                    setFieldValue("picture", acceptedFiles[0])
                  }
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed ${palette.primary.main}`}
                      p="1rem"
                      sx={{
                        "&:hover": {
                          cursor: "pointer",
                        },
                      }}
                    >
                      <input {...getInputProps()} />

                      {!values.picture ? (
                        <p>Add picture here </p>
                      ) : (
                        <FlexBetween>
                          <Typography>{values.picture.name}</Typography>
                          <EditOutlinedIcon />
                        </FlexBetween>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
              {isSuccess && (
                <Typography sx={{ gridColumn: "span 4" }}>
                  <Alert severity="success">{msg}</Alert>
                </Typography>
              )}
              {err && (
                <Typography sx={{ gridColumn: "span 4" }}>
                  <Alert severity="danger">{err}</Alert>
                </Typography>
              )}
            </>
          </Box>

          {/* Buttons */}

          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "0.6rem",
                backgroundColor: palette.primary.dark,
                color: "white",
                fontSize: "1.2rem",
                "&:hover": { color: palette.primary.dark },
              }}
            >
              UPDATE
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default EditForm;
