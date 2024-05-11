import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import { useSelector } from "react-redux";
import FlexBetween from "../../components/FlexBetween";
import { IconButton } from "@mui/material";
import { DarkMode, LightMode } from "@mui/icons-material";

import { useDispatch } from "react-redux";
import { setMode } from "../../reducers";

function LoginPage() {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const { palette } = useTheme();
  const mode = useSelector((state) => state.mode);
  const dispatch = useDispatch();
  return (
    <>
      <Box>
        <Box
          width="100%"
          backgroundColor={theme.palette.background.alt}
          p="1rem 6%"
          
        >
          <FlexBetween>
            <Typography
              fontWeight="bold"
              fontSize="32px"
              color={
                mode === "dark" ? palette.neutral.dark : palette.primary.main
              }
              sx={{
                "&:hover": {
                  color:
                    mode === "dark"
                      ? palette.primary.light
                      : palette.primary.dark,
                  cursor: "pointer",
                },
              }}
            >
              Blend Buddies
            </Typography>
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode
                  sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }}
                />
              )}
            </IconButton>
          </FlexBetween>
        </Box>

        <Box
          width={isNonMobileScreens ? "30%" : "93%"}
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
            Welcome to Blend Buddies: Your Home for Social Blending!
          </Typography>
          <Form />
        </Box>
      </Box>
    </>
  );
}

export default LoginPage;
