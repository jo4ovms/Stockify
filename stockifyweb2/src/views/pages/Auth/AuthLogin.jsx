import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField";
import AuthService from "../../../services/AuthService";

const AuthLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    AuthService.login(username, password).then(
      () => {
        navigate("/dashboard");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  return (
    <Box>
      <Typography fontWeight="700" variant="h2" mb={1}>
        Entrar em uma conta
      </Typography>
      <Stack>
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
        <Box mt="25px">
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
        <Stack
          justifyContent="space-between"
          direction="row"
          alignItems="center"
          my={2}
        >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Lembrar desse dispositivo"
            />
          </FormGroup>
        </Stack>
      </Stack>
      <Box>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Loading..." : "Entrar"}
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
        Não possui uma conta? <Link to="/auth/register">Criar uma conta</Link>
      </Typography>
    </Box>
  );
};

export default AuthLogin;
