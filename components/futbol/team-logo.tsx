import * as React from "react";

const Image = ({ src, size = 1 }: { src: string; size?: number }) => {
  const cssSize = `${size}em`;
  return <img src={src} style={{ width: cssSize, height: cssSize }} />;
};

export type TeamLogoProps = {
  type: "kangaroo" | "penguin";
  size?: number;
};

const TeamLogo = ({ type, size = 1 }: TeamLogoProps): JSX.Element => {
  if (type === "kangaroo")
    return <Image size={size} src="/futbol/kangaroo.png" />;
  else return <Image size={size} src="/futbol/penguin.png" />;
};

export default TeamLogo;
