import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import AuthService from "../../../services/AuthService";

const AuthRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("As senhas devem ser iguais");
      return;
    }

    AuthService.register(username, email, password).then(
      () => {
        navigate("/auth/login");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setMessage(resMessage);
      }
    );
  };

  return (
    <Box>
      <Typography fontWeight="700" variant="h2" mb={1}>
        Registrar
      </Typography>
      <Stack spacing={1}>
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb="5px">
            Nome de Usuário
          </Typography>
          <CustomTextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt="20px">
          <Typography variant="subtitle1" fontWeight={600} mb="5px">
            Email
          </Typography>
          <CustomTextField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt="20px">
          <Typography variant="subtitle1" fontWeight={600} mb="5px">
            Senha
          </Typography>
          <CustomTextField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Box mt="20px" mb="10px">
          <Typography variant="subtitle1" fontWeight={600} mb="5px">
            Confirme a Senha
          </Typography>
          <CustomTextField
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Box>
      </Stack>
      <Box mt={2}>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleRegister}
        >
          Registrar
        </Button>
      </Box>
      {message && (
        <Typography color="error" mt={2}>
          {message}
        </Typography>
      )}
      <Typography
        variant="subtitle1"
        textAlign="center"
        color="textSecondary"
        mt={2}
      >
        Já possui uma conta? <Link to="/auth/login">Entrar em uma conta</Link>
      </Typography>
    </Box>
  );
};

export default AuthRegister;
