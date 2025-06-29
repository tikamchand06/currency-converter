import { ConfigProvider } from "antd";

export default function ThemeProvider({ children }) {
  return (
    <ConfigProvider
      theme={{
        hashed: false,
        token: {
          controlHeight: 36,
          colorInfo: "#1D4FFD",
          colorLink: "#2E62E9",
          colorError: "#F53D6B",
          colorPrimary: "#1E4DF5",
          colorSuccess: "#4EBF61",
          colorWarning: "#FA942E",
          colorTextBase: "#364152",
          colorBorder: "#E3E8EF",
          colorTextPlaceholder: "#6C6C89",
          fontFamily: "Inter",
        },
        components: {
          Badge: { dotSize: 8 },
          Tag: { borderRadiusSM: 8 },
          Input: { controlHeight: 36 },
          Select: { colorBorder: "#E3E8EF", controlHeight: 36 },
          Button: {
            fontWeight: 500,
            borderRadius: 8,
            borderRadiusSM: 8,
            controlHeight: 36,
            controlHeightSM: 32,
            dangerColor: "#D50B3E",
            colorBgSolid: "#121217",
            colorPrimary: "#2E62E9",
            defaultColor: "#3F3F50",
            paddingBlockSM: "4px 8px 4px",
            defaultHoverBg: "#F7F7F8",
            defaultHoverColor: "#3F3F50",
            defaultHoverBorderColor: "#E3E8EF",
            defaultBorderColor: "#D1D1DB",
          },
          Radio: { colorBorder: "#112260" },
          Alert: { colorWarningBg: "#FFF9EB" },
          Dropdown: {
            colorText: "#364152",
            colorPrimary: "#364152",
            controlItemBgActive: "#F8FAFC",
            controlItemBgActiveHover: "#F8FAFC",
          },
          Card: { paddingLG: 16, colorBorderSecondary: "#e3e8ef" },
          Modal: { colorBgMask: "rgba(0,0,0,0.5)", titleColor: "#202939", titleFontSize: 18 },
          Typography: { colorText: "#121217", colorTextHeading: "#121217", colorTextDescription: "#6C6C89", fontWeightStrong: 500 },
          Layout: { bodyBg: "#FFFFFF", headerBg: "#FFFFFF" },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
