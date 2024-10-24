import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import LogoDark from "../../../../assets/logos/dark-logo.svg?react";

const LinkStyled = styled(Link)(() => ({
  height: "70px",
  width: "180px",
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <LogoDark height={70} />
    </LinkStyled>
  );
};
export default Logo;
