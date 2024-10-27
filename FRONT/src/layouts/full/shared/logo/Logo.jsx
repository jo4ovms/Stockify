/* eslint-disable import/no-unresolved */
import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import LogoDark from "../../../../assets/logos/dark-logo.svg?react";
import { isAuthenticated } from "../../../../views/dashboard/components/utils";

const LinkStyled = styled(Link)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  maxWidth: "180px",
  height: "auto",
  overflow: "hidden",
  textDecoration: "none",
  transition: "opacity 0.3s ease, transform 0.3s ease",
  "&:hover": {
    opacity: 0.8,
    transform: "scale(1.05)",
  },
}));

const Logo = () => {
  const targetPath = isAuthenticated() ? "/dashboard" : "/";
  return (
    <LinkStyled to={targetPath} aria-label="Home">
      <LogoDark
        height="70"
        width="auto"
        alt="Stockify Logo"
        aria-hidden="true"
      />
    </LinkStyled>
  );
};

export default Logo;
