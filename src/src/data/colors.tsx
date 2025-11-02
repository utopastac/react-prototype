import { LIGHT, DARK } from 'src/containers/ThemeContext';
//
export const BASE_GREY_10 =         "#101010";
export const BASE_GREY_20 =         "#1E1E1E";
export const BASE_GREY_50 =         "#666666";
export const BASE_GREY_60 =         "#959595";
export const BASE_GREY_80 =         "#CCCCCC";
export const BASE_GREY_85 =         "#DADADA";
export const BASE_GREY_90 =         "#E8E8E8";
export const BASE_GREY_95 =         "#F0F0F0";
//
export const BASE_DARK_GREY_15 =    "#1A1A1A";
export const BASE_DARK_GREY_25 =    "#232323";
export const BASE_DARK_GREY_30 =    "#2A2A2A";
export const BASE_DARK_GREY_40 =    "#333333";
export const BASE_DARK_GREY_45 =    "#595959";
export const BASE_DARK_GREY_60 =    "#878787";
export const BASE_DARK_GREY_90 =    "#E1E1E1";
//
export const BASE_CONSTANT_BLACK =  "#000000";
export const BASE_CONSTANT_WHITE =  "#FFFFFF";
//
export const BASE_AMBER_10 =        "#F46E38";
export const BASE_AMBER_20 =        "#CC4B03";
export const BASE_RED_50 =          "#F84752";
export const BASE_RED_60 =          "#D3040E";
export const BASE_GREEN_10 =        "#00D149";
export const BASE_GREEN_15 =        "#00B843";
export const BASE_GREEN_20 =        "#00792C";
export const BASE_PURPLE_10 =       "#AC8EFF";
export const BASE_PURPLE_20 =       "#660199";
export const BASE_BLUE_10 =         "#2B8DE7";
export const BASE_BLUE_20 =         "#007CC1";
export const BASE_CASH_GREEN_10 =   "#00D64F";
export const BASE_CASH_GREEN_30 =   "#00BD46";
//
export const BASE_BITCOIN =         "#00D4FF";
//
//
//
//
export const BITCOIN =              "COLOR_BITCOIN";
export const BORDER_SUBTLE =        "COLOR_BORDER_SUBTLE";
export const ICON_BRAND =           "COLOR_ICON_BRAND";
//
//
//
//
export const GetColor = (color, theme) => {
  switch(color){
    case BORDER_SUBTLE:
      return theme === LIGHT ? BASE_GREY_90 : BASE_DARK_GREY_25;
    case ICON_BRAND:
      return theme === LIGHT ? BASE_CASH_GREEN_10 : BASE_CASH_GREEN_30;
    case BITCOIN:
      return theme === LIGHT ? BASE_BITCOIN : BASE_BITCOIN;
    default:
      return BASE_CONSTANT_WHITE;
  }
}