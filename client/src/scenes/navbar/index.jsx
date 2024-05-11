import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,

} from "@mui/material";

import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";

import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout, setPosts } from "../../reducers";
import { useNavigate, Link } from "react-router-dom";
import FlexBetween from "../../components/FlexBetween";
import { API_URL } from "../../config";

function Navbar() {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state?.user);
  const mode = useSelector((state) => state.mode);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  if(!token){
    navigate("/");
  }

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const alt = theme.palette.background.alt;

  const fullName = `${user?.firstName} ${user?.lastName}`;

  // Debounce search 
  const handleSearch = (e) => {
    setSearchTerm(e?.target?.value);
  };

  const searchQuery = async () => {
    try {
      const res = await fetch(
        `${API_URL}/posts/search?searchTerm=${searchTerm}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const allPosts = await res.json();
      dispatch(setPosts({ posts: allPosts }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(searchQuery, 300);

    // Cleanup function to clear the timeout on component unmount or when searchTerm changes
    return () => clearTimeout(delaySearch);

  }, [searchTerm]);

  


  return (
    <FlexBetween
      padding="1rem 6%"
      backgroundColor={alt}
      sx={{
        boxShadow: `0px 2px 4px ${
          theme.palette.mode === "dark"
            ? "rgba(242, 242, 242, 0.2)"
            : "rgba(0, 0, 0, 0.1)"
        }`,
      }}
    >
      <FlexBetween gap="5rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color={
            mode === "dark" ? theme.palette.light : theme.palette.primary.main
          }
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              color: theme.palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          Blend Buddies
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={neutralLight}
            borderRadius="9px"
            gap="4rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
      </FlexBetween>

      {/* Desktop Nav */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "light" ? (
              <DarkMode sx={{ color: dark, fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton  onClick={() => navigate("/chat")}>
            <Message sx={{ fontSize: "25px", cursor:"pointer", color: dark }} />
          </IconButton>
          <IconButton>
            <Notifications sx={{ fontSize: "25px",  cursor:"pointer", color: dark }} />
          </IconButton>       
          
          <IconButton>
            <Help sx={{ fontSize: "25px",  cursor:"pointer", color: dark }} />
          </IconButton>  
          
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: neutralLight,
                maxWidth: "250px",
                borderRadius: "0.25rem",
                padding: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: neutralLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName} onClick={() => navigate("/home")}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Logout</MenuItem>
            </Select>
          </FormControl>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* Mobile Nav */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zindex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
          zIndex={3}
        >
          {/* Close icon */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            <IconButton  onClick={() => navigate("/chat")}>
              <Message sx={{ fontSize: "25px", cursor:"pointer", color: dark }} />
            </IconButton>        
            <Notifications sx={{ fontSize: "25px" }} />
            <Help sx={{ fontSize: "25px" }} />
            <FormControl variant="standard" value={fullName}>
              <Select
                value={fullName}
                sx={{
                  backgroundColor: neutralLight,
                  width: "165px",
                  borderRadius: "0.25rem",
                  padding: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: neutralLight,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Logout
                </MenuItem>
              </Select>
            </FormControl>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
}

export default Navbar;
