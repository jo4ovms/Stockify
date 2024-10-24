import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.logout();
    navigate("/auth/login");
    window.location.reload();
  }, [navigate]);

  return null;
};

export default Logout;
