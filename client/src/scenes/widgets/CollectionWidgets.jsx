import {
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import {
    ImageOutlined,
    OndemandVideoOutlined,
    RateReviewOutlined
    
  } from "@mui/icons-material";
  
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";


const CollectionWidgets = ({setShowPhotos}) => {
  
    const {palette} = useTheme();
    const main = palette.primary.main


  return (
    <WidgetWrapper>
      <Box display="flex" justifyContent="space-around" alignItems="center">
      <FlexBetween gap="0.25rem">
          <RateReviewOutlined  />
          <Typography
            
            onClick={()=> setShowPhotos(false) }
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: main,
              },
            }}
          >
            Posts
          </Typography>
        </FlexBetween>
        <FlexBetween gap="0.25rem">
          <ImageOutlined  />
          <Typography
            
            onClick={()=> setShowPhotos(true) }
            sx={{
              "&:hover": {
                cursor: "pointer",
                color: main,
              },
            }}
          >
            Photos
          </Typography>
        </FlexBetween>
    
        <FlexBetween gap="0.25rem">
          <OndemandVideoOutlined  />
          <Typography 
            
            sx={{
                "&:hover": {
                  cursor: "pointer",
                  color: main,
                },
              }}
            >
                Videos
            </Typography>
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default CollectionWidgets;
