import {
  LIGHT, DARK,
  SCALE_1, SCALE_0_POINT_75, SCALE_1_POINT_1, SCALE_1_POINT_2, SCALE_1_POINT_5,
  DEVICE_EXTRA_SMALL, DEVICE_SMALL, DEVICE_STANDARD, DEVICE_LARGE
} from 'src/containers/ThemeContext';

export const themes = [
  {
    title: "Theme",
    type: "theme",
    data: [
      { label: "Light", themeName: LIGHT },
      { label: "Dark", themeName: DARK }
    ]
  },
  {
    title: "Device",
    type: "device",
    data: [
      { label: "XS", themeName: DEVICE_EXTRA_SMALL },
      { label: "S", themeName: DEVICE_SMALL },
      { label: "M", themeName: DEVICE_STANDARD },
      { label: "L", themeName: DEVICE_LARGE }
    ]
  },
  {
    title: "Type size",
    type: "scale",
    data: [
      { label: "0.75x", themeName: SCALE_0_POINT_75 },
      { label: "1x", themeName: SCALE_1 },
      { label: "1.1x", themeName: SCALE_1_POINT_1 },
      { label: "1.2x", themeName: SCALE_1_POINT_2 },
      { label: "1.5x", themeName: SCALE_1_POINT_5 }
    ]
  }
];

export type ThemeOption = typeof themes[number];

