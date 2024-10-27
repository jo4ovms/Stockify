import { Box, Typography, Button, Stack } from "@mui/material";
import { Formik, Form, Field } from "formik";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import CustomTextField from "../../../components/forms/theme-elements/CustomTextField.jsx";
import AuthService from "../../../services/AuthService";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "O nome de usuário deve ter pelo menos 3 caracteres")
    .required("Nome de usuário é obrigatório"),
  email: Yup.string()
    .email("Endereço de email inválido")
    .required("Email é obrigatório"),
  password: Yup.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(40, "A senha deve ter no maximo 40 caracteres")
    .required("Senha é obrigatória"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "As senhas devem ser iguais")
    .required("Confirmação de senha é obrigatória"),
});

const AuthRegister = () => {
  const navigate = useNavigate();

  const handleRegister = (values, { setSubmitting, setStatus }) => {
    AuthService.register(values.username, values.email, values.password).then(
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
        setStatus({ message: resMessage });
        setSubmitting(false);
      }
    );
  };

  return (
    <Box>
      <Typography fontWeight="700" variant="h2" mb={1}>
        Registrar
      </Typography>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleRegister}
      >
        {({ isSubmitting, errors, touched, status }) => (
          <Form>
            <Stack spacing={1}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Nome de Usuário
                </Typography>
                <Field
                  name="username"
                  as={CustomTextField}
                  variant="outlined"
                  fullWidth
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
              </Box>

              <Box mt="20px">
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Email
                </Typography>
                <Field
                  name="email"
                  type="email"
                  as={CustomTextField}
                  variant="outlined"
                  fullWidth
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Box>

              <Box mt="20px">
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Senha
                </Typography>
                <Field
                  name="password"
                  type="password"
                  as={CustomTextField}
                  variant="outlined"
                  fullWidth
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
              </Box>

              <Box mt="20px" mb="10px">
                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                  Confirme a Senha
                </Typography>
                <Field
                  name="confirmPassword"
                  type="password"
                  as={CustomTextField}
                  variant="outlined"
                  fullWidth
                  error={
                    touched.confirmPassword && Boolean(errors.confirmPassword)
                  }
                  helperText={touched.confirmPassword && errors.confirmPassword}
                />
              </Box>
            </Stack>

            <Box mt={2}>
              <Button
                color="primary"
                variant="contained"
                size="large"
                fullWidth
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Carregando..." : "Registrar"}
              </Button>
            </Box>

            {status && status.message && (
              <Typography color="error" mt={2} align="center">
                {status.message}
              </Typography>
            )}
          </Form>
        )}
      </Formik>

      <Typography
        variant="subtitle1"
        textAlign="center"
        color="textSecondary"
        mt={2}
      >
        Já possui uma conta?{" "}
        <Link
          to="/auth/login"
          style={{ textDecoration: "none", color: "#5D87FF" }}
        >
          Entrar em uma conta
        </Link>
      </Typography>
    </Box>
  );
};

export default AuthRegister;
