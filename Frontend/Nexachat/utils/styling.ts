import { Dimensions, PixelRatio } from "react-native";
// check the screen size and the width at real time
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
// check the landscape and potrait mode of the screen so that the code may not broke when the user may change the code
const [shortDimension, longDimension] =
  SCREEN_WIDTH < SCREEN_HEIGHT
    ? [SCREEN_WIDTH, SCREEN_HEIGHT]
    : [SCREEN_HEIGHT, SCREEN_WIDTH];

//taking the example height and width of iphone x as an example
const guideLineBaseWidth = 375;
const guideLineBaseHeight = 860;

export const scale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      (shortDimension / guideLineBaseWidth) * size,
    ),
  );

export const VerticalScale = (size: number) =>
  Math.round(
    PixelRatio.roundToNearestPixel(
      (longDimension / guideLineBaseHeight) * size,
    ),
  );
