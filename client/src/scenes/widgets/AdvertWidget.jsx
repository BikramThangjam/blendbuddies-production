import { Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/FlexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { API_URL } from "../../config";

const AdvertWidget = () => {
    const adsImg = "https://res.cloudinary.com/doqjl4k7t/image/upload/v1714896604/blendbuddies/ads1.jpg";
    const {palette} = useTheme()
    const dark = palette.neutral.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

  return (
   <WidgetWrapper>
    <FlexBetween>
        <Typography
            color={dark}
            variant="h5"
            fontWeight="500"
        >
            Sponsored
        </Typography>
        <Typography
            color={medium}
        >
            Create Ad
        </Typography>
    </FlexBetween>
    <img 
        width="100%"  
        alt= "Ads"   
        src={adsImg}
        style={{borderRadius: "0.75rem", margin: "0.75rem 0", maxHeight:"300px", objectFit: "cover"}}     
    />
    <FlexBetween>
        <Typography color={main}>Himalaya Cosmetics</Typography>
        <Typography color={medium}>himalaya.co.in</Typography>
    </FlexBetween>
    <Typography color={medium} m="0.5rem 0">
        Nourish Your Skin, Embrace Softness
        Treat your skin to the luxurious care it deserves with Himalaya Herbals Nourishing Cocoa Butter Body Lotion.
    </Typography>
   </WidgetWrapper>
  )
}

export default AdvertWidget
