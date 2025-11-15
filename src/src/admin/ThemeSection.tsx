import React from "react";
import { useTheme, useThemeDispatch, ThemeObject, UPDATE_THEME } from 'src/containers/ThemeContext';
import { themes } from 'src/admin/ThemeOptions';
import LabeledInput from 'src/admin/components/LabeledInput';

const ThemeSection: React.FC = () => {
  const themeDispatch = useThemeDispatch();
  const themeObject: ThemeObject = useTheme();
  const { theme, scale, device } = themeObject;

  const switchTheme = (type: string, theme: string): void => {
    themeDispatch!({ type: UPDATE_THEME, payload: { [type]: theme } });
  };

  return (
    <>
      {themes.map((themeContent, index) => {
        const { title, type, data } = themeContent;
        let match = '';
        if (type === 'theme') match = theme;
        else if (type === 'device') match = device;
        else if (type === 'scale') match = scale;
        const options = data.map((item: { label: string; themeName: string }) => ({ value: item.themeName, label: item.label }));
        return (
          <div key={`themeSection-${index}`}>
            <LabeledInput
              config={{ type: 'select', label: title, options }}
              value={match}
              onChange={(val: string) => switchTheme(type, val)}
            />
          </div>
        );
      })}
    </>
  );
};

export default ThemeSection; 