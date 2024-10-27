import {
  ArrowDownward,
  Store,
  Receipt,
  LocalShipping,
  Analytics,
  People,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Card,
  Avatar,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { styled, keyframes } from "@mui/system";
import { IconReload } from "@tabler/icons-react";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const NavbarButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  margin: theme.spacing(1),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const Section = styled(Box)(({ theme }) => ({
  padding: theme.spacing(8, 0),
  scrollMarginTop: "80px",
  animation: `${fadeIn} 0.8s ease-in-out`,
}));

const Hero = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #5D87FF, #49BEFF)",
  color: theme.palette.common.white,
  padding: theme.spacing(10, 0),
  textAlign: "center",
  animation: `${fadeIn} 1s ease-in-out`,
}));

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleSubscribe = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({
        type: "error",
        message: "Por favor, insira um email válido.",
      });
      return;
    }

    setLoading(true);
    setFeedback(null);

    setTimeout(() => {
      setLoading(false);
      setFeedback({
        type: "success",
        message:
          "Obrigado por entrar em contato! Verifique seu email para mais informações.",
      });
      setEmail("");
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubscribe();
    }
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: "#5D87FF" }}>
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontFamily: "Plus Jakarta Sans" }}
          >
            Stockify
          </Typography>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <NavbarButton href="#about">Sobre</NavbarButton>
            <NavbarButton href="#features">Funcionalidades</NavbarButton>
            <NavbarButton href="#contact">Contato</NavbarButton>
            <Button
              component={RouterLink}
              to="/auth/login"
              variant="text"
              color="inherit"
              sx={{
                ml: 2,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              Login
            </Button>
            <Button
              component={RouterLink}
              to="/auth/register"
              variant="text"
              color="inherit"
              sx={{
                ml: 1,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              Registrar
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: "flex", md: "none" }, color: "#fff" }}
            onClick={toggleMobileMenu}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>

        {mobileMenuOpen && (
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#5D87FF",
              p: 2,
            }}
          >
            <NavbarButton href="#about" fullWidth>
              Sobre
            </NavbarButton>
            <NavbarButton href="#features" fullWidth>
              Funcionalidades
            </NavbarButton>
            <NavbarButton href="#testimonials" fullWidth>
              Depoimentos
            </NavbarButton>
            <NavbarButton href="#pricing" fullWidth>
              Preços
            </NavbarButton>
            <NavbarButton href="#contact" fullWidth>
              Contato
            </NavbarButton>
            <NavbarButton
              component={RouterLink}
              to="/auth/login"
              fullWidth
              sx={{
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              Login
            </NavbarButton>
            <NavbarButton
              component={RouterLink}
              to="/auth/register"
              fullWidth
              sx={{
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
            >
              Registrar
            </NavbarButton>
          </Box>
        )}
      </AppBar>

      <Hero>
        <Container maxWidth="md">
          <Typography variant="h1" gutterBottom>
            Bem-vindo ao Stockify
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4 }}>
            Gerencie seu estoque de forma eficiente, moderna e segura!
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            href="#about"
            endIcon={<ArrowDownward />}
            sx={{ padding: "12px 24px", fontSize: "1rem", fontWeight: 600 }}
          >
            Saiba Mais
          </Button>
        </Container>
      </Hero>

      <Section id="about" sx={{ backgroundColor: "#f0f2f5" }}>
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom align="center">
            Sobre o Stockify
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            O Stockify é uma solução inovadora para gerenciar o estoque de sua
            empresa com facilidade. Desenvolvido com tecnologias modernas como
            React e Spring Boot, nosso objetivo é ajudar empresas a automatizar
            e otimizar a gestão de produtos, fornecedores e vendas.
          </Typography>
        </Container>
      </Section>

      <Section id="features">
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom align="center">
            Funcionalidades Principais
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <Store />,
                title: "Gestão de Produtos",
                description:
                  "Crie, edite e gerencie informações de produtos, incluindo preços, categorias e descrições.",
              },
              {
                icon: <Receipt />,
                title: "Gerenciamento de Vendas",
                description:
                  "Registre vendas, visualize relatórios e acompanhe o histórico de transações com facilidade.",
              },
              {
                icon: <LocalShipping />,
                title: "Gestão de Fornecedores",
                description:
                  "Adicione, edite e gerencie fornecedores para garantir um fluxo contínuo de estoque.",
              },
              {
                icon: <Analytics />,
                title: "Análise de Estoque",
                description:
                  "Monitore o nível crítico de estoque e visualize alertas para otimizar a reposição de produtos.",
              },
              {
                icon: <People />,
                title: "Controle de Acessos",
                description:
                  "Autenticação segura para gerenciar usuários e permissões de acesso.",
              },
              {
                icon: <IconReload />,
                title: "Futuras Funcionalidades",
                description:
                  "Novos recursos estão em desenvolvimento para aprimorar ainda mais a gestão do seu estoque.",
              },
            ].map((feature, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    height: "100%",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#49BEFF", mb: 2, mx: "auto" }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", mt: 1 }}
                  >
                    {feature.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Section>

      <Section id="contact" sx={{ backgroundColor: "#f0f2f5" }}>
        <Container maxWidth="sm">
          <Typography variant="h2" gutterBottom align="center">
            Contato
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Tem alguma dúvida ou sugestão? Entre em contato conosco!
          </Typography>
          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="Seu Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={handleEmailChange}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ padding: "12px 24px", mt: 2 }}
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Enviar"
              )}
            </Button>
            {feedback && (
              <Alert severity={feedback.type} sx={{ mt: 2 }}>
                {feedback.message}
              </Alert>
            )}
          </Box>
        </Container>
      </Section>
    </>
  );
};

export default LandingPage;
