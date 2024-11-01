import {
  Box,
  Typography,
  Button,
  Stack,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

import { Formik, Form, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField.jsx";
import AuthService from "../../../services/AuthService";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Nome de usuário é obrigatório")
    .min(4, "Nome de usuário deve ter pelo menos 4 caracteres"),
  password: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
});

const AuthLogin = () => {
  const initialValues = {
    username: "",
    password: "",
    rememberMe: false,
  };
  const navigate = useNavigate();

  const handleLogin = (values, { setSubmitting, setFieldError }) => {
    AuthService.login(values.username, values.password)
      .then(() => {
        navigate("/dashboard");
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setFieldError("general", resMessage);
        setSubmitting(false);
      });
  };

  return (
    <Box>
      <Typography fontWeight="700" variant="h2" mb={1} align="center">
        Entrar em uma conta
      </Typography>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        {({ errors, touched, isSubmitting, handleChange, values }) => (
          <Form>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Nome de Usuário
                </Typography>
                <Field
                  as={CustomTextField}
                  name="username"
                  variant="outlined"
                  fullWidth
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Box>

              <Box mt="25px">
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Senha
                </Typography>
                <Field
                  as={CustomTextField}
                  type="password"
                  name="password"
                  variant="outlined"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Stack
                justifyContent="space-between"
                direction="row"
                alignItems="center"
                mt={1}
              >
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={values.rememberMe}
                        onChange={handleChange}
                      />
                    }
                    label="Lembrar desse dispositivo"
                  />
                </FormGroup>
              </Stack>

              <Box>
                <Button
                  color="primary"
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Carregando..." : "Entrar"}
                </Button>
              </Box>

              {errors.general && (
                <Typography color="error" mt={2} align="center">
                  {errors.general}
                </Typography>
              )}
            </Stack>
          </Form>
        )}
      </Formik>

      <Typography
        variant="subtitle1"
        textAlign="center"
        color="textSecondary"
        mt={2}
      >
        Não possui uma conta?{" "}
        <Link
          to="/auth/register"
          style={{ textDecoration: "none", color: "#5D87FF" }}
        >
          Criar uma conta
        </Link>
      </Typography>
    </Box>
  );
};

export default AuthLogin;
