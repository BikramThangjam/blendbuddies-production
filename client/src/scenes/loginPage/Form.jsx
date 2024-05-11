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
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import FlexBetween from "../../components/FlexBetween";
import { setLogin } from "../../reducers";
import { API_URL } from "../../config";

const registerSchema = Yup.object().shape({
  firstName: Yup.string().required("required"),
  lastName: Yup.string().required("required"),
  email: Yup.string().email("invalid email").required("required"),
  password: Yup.string().required("required"),
  location: Yup.string().required("required"),
  occupation: Yup.string().required("required"),
  picture: Yup.string(),
});

const loginSchema = Yup.object().shape({
  email: Yup.string().email("invalid email").required("required"),
  password: Yup.string().required("required"),
});

const initialValueRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValueLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [err, setErr] = useState(null);
  const [pageType, setPageType] = useState("login");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const register = async (values, onSubmitProps) => {
    // this allows us to send form info with image
    const formData = new FormData();
    for (let value in values){
        formData.append(value, values[value])
    }
    // formData.append('picturePath', values?.picture?.name || "");

    const savedUserResponse = await fetch(
        `${API_URL}/auth/register`,
        {
            method: "POST",
            body: formData
        }
    );
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm()

    if(savedUser){
        setPageType("login")
    }
  }

  const login = async (values, onSubmitProps) => {

    const loggedInResponse = await fetch(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(values)
        }
    );

    if (loggedInResponse.status === 400) {
      const errorResponse = await loggedInResponse.json();
      setErr(errorResponse.msg)      
      return;
    }

    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm();

    if(loggedIn){
        dispatch(
            setLogin({
                user: loggedIn.user,
                token: loggedIn.token,
            })
        );
        setErr(null);
        navigate("/home");
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if(isLogin) await login(values, onSubmitProps);
    if(isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValueLogin : initialValueRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"    
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}        
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
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
                    {
                        ({ getRootProps, getInputProps }) => (
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
                        )
                    }
                  </Dropzone>
                </Box>
              </>
            )}

            

            {/* {Login form} */}
            
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4"}}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.passord}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
            {
              err && (
                <Typography sx={{ gridColumn: "span 4" }}>
                  <Alert severity="error">{err}</Alert>
                </Typography>
              )
            }
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
                    "&:hover": {color: palette.primary.dark},
                }}
            >
                {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Typography
                onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    setErr(null);
                    resetForm();
                }}
                sx={{
                    textDecoration: "underline",
                    color: palette.neutral.medium,
                    "&:hover": {
                        cursor: "pointer",
                        color: palette.primary.dark,
                    },
                }}
            >
                {isLogin 
                    ? "Don't have an account? Sign up here."
                    : "Already have an account? Login here."
                }
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
