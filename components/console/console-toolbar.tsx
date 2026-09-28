"use client";

import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import DarkModeRounded from "@mui/icons-material/DarkModeRounded";
import LanguageRounded from "@mui/icons-material/LanguageRounded";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import {
  FormControl,
  NativeSelect,
} from "@mui/material";
import type { ConsoleTheme, Locale, Role } from "./types";

type ConsoleToolbarProps = {
  locale: Locale;
  theme: ConsoleTheme;
  role: Role;
  onLocaleChange: (locale: Locale) => void;
  onThemeChange: (theme: ConsoleTheme) => void;
  onRoleChange: (role: Role) => void;
};

const selectSx = {
  minWidth: 92,
  color: "var(--paper)",
  fontSize: 13,
  fontWeight: 700,
  "& .MuiNativeSelect-select": { py: 0.75, pl: 1, pr: "28px !important" },
  "&::before, &::after": { display: "none" },
  "& .MuiSvgIcon-root": { color: "var(--muted)" },
};

export function ConsoleToolbar({
  locale,
  theme,
  role,
  onLocaleChange,
  onThemeChange,
  onRoleChange,
}: ConsoleToolbarProps) {
  return (
    <div className="console-toolbar" aria-label="Console preferences">
      <LanguageRounded fontSize="small" />
      <FormControl size="small" variant="standard">
        <NativeSelect
          value={locale}
          onChange={(event) => onLocaleChange(event.target.value as Locale)}
          inputProps={{ "aria-label": "Language" }}
          sx={selectSx}
        >
          <option value="vi">VI</option>
          <option value="en">EN</option>
        </NativeSelect>
      </FormControl>

      <span className="theme-icon" aria-hidden="true">
        {theme === "dark" ? <DarkModeRounded fontSize="small" /> : <LightModeRounded fontSize="small" />}
      </span>
      <FormControl size="small" variant="standard" className="theme-select">
        <NativeSelect
          value={theme}
          onChange={(event) => onThemeChange(event.target.value as ConsoleTheme)}
          inputProps={{ "aria-label": "Color theme" }}
          sx={{ ...selectSx, minWidth: 86 }}
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </NativeSelect>
      </FormControl>

      <AdminPanelSettingsRounded fontSize="small" />
      <FormControl size="small" variant="standard" className="role-select">
        <NativeSelect
          value={role}
          onChange={(event) => onRoleChange(event.target.value as Role)}
          inputProps={{ "aria-label": "Active role" }}
          sx={{ ...selectSx, minWidth: 154 }}
        >
          <option value="Test Engineer">Test Engineer</option>
          <option value="Safety Reviewer">Safety Reviewer</option>
          <option value="Admin">Admin</option>
        </NativeSelect>
      </FormControl>
    </div>
  );
}
