import React, { useMemo } from "react";
import { Avatar } from "antd";

interface UserAvatarProps {
  name?: string;
  size?: number;
  opacity?: number;
  className?: string;
  onClick?: () => void;
}

const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const r = (hash >> 24) & 0xff;
  const g = (hash >> 16) & 0xff;
  const b = (hash >> 8) & 0xff;
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

// เช็กความสว่างของสี เพื่อเลือกสีตัวอักษร
const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // คำนวณ brightness ตาม W3C
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 200 ? "#000" : "#fff";
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  size = 24,
  opacity = 1,
  className,
  onClick,
}) => {
  const { usrAvatar, backgroundColor, textColor } = useMemo(() => {
    const usrAvatar = name ? name.charAt(0).toUpperCase() : "HL";
    const backgroundColor =
      usrAvatar === "HL" ? "#029488" : stringToColor(name || "default");
    const textColor = getContrastColor(backgroundColor);
    return { usrAvatar, backgroundColor, textColor };
  }, [name]);

  return (
    <Avatar
      className={className}
      size={size}
      style={{ backgroundColor, color: textColor, opacity }}
      onClick={onClick}
    >
      {usrAvatar}
    </Avatar>
  );
};

export default UserAvatar;
