import React, { PropsWithChildren, createContext, useContext } from "react";

const ThemeContext = createContext({ themeName: "html", settings: {} });

export const ThemeProvider: React.FC<
    PropsWithChildren<{ theme: string; themeSettings: unknown }>
> = ({ children, theme, themeSettings }) => (
    <ThemeContext.Provider
        value={{ themeName: theme, settings: themeSettings }}
    >
        {children}
    </ThemeContext.Provider>
);

export const useTheme = () => useContext(ThemeContext);
