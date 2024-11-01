import { Box, Card } from "@mui/material";
import PageContainer from "../../../components/container/PageContainer.jsx";
import Logo from "../../../layouts/full/shared/logo/Logo.jsx";
import AuthLogin from "./AuthLogin.jsx";

const Login = () => {
  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
          animation: "gradient 15s ease infinite",
        }}
      >
        <Card
          elevation={7}
          sx={{
            padding: 4,
            maxWidth: 400,
            width: "100%",
            zIndex: 1,
            position: "relative",
          }}
        >
          <Box display="flex" justifyContent="center" mb={3}>
            <Logo />
          </Box>
          <AuthLogin />
        </Card>
      </Box>
    </PageContainer>
  );
};

export default Login;
