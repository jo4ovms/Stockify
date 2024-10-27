import {
  Typography,
  CardContent,
  Box,
  Chip,
  LinearProgress,
  Button,
  Divider,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import PageContainer from "../../../components/container/PageContainer.jsx";
import BlankCard from "../../../components/shared/BlankCard.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";

const Roadmap = () => {
  const futureFeatures = [
    {
      title: "Papéis e Permissões de Usuário",
      description:
        "Controle de acesso baseado em papéis para uma gestão mais segura e eficiente de usuários.",
      benefits:
        "Melhora a segurança dos dados ao limitar o acesso com base nas funções dos usuários.",
      useCases:
        "Atribua papéis de 'Gerente' para ajuste de estoque e 'Visualizador' para acesso apenas leitura.",
      status: 80,
      timeframe: "Q4 2024",
    },
    {
      title: "Painel de Analytics",
      description:
        "Obtenha insights com tendências de vendas em tempo real, alertas de estoque e previsão de demanda.",
      benefits:
        "Ajuda a entender o desempenho de produtos, identificar tendências e tomar decisões informadas para reposição de estoque.",
      useCases:
        "Acompanhe tendências de vendas mensais, receba alertas de baixo estoque e preveja demanda com base em dados históricos.",
      status: 30,
      timeframe: "Q1 2025",
    },
    {
      title: "Integração com E-commerce",
      description:
        "Integre a Stockify com plataformas como Shopify, WooCommerce e Magento para sincronização perfeita.",
      benefits:
        "Permite gestão multicanal, sincronização de estoque em tempo real e processamento de pedidos mais rápido.",
      useCases:
        "Sincronize automaticamente listagens de produtos e atualizações de estoque em plataformas de e-commerce.",
      status: 25,
      timeframe: "Q4 2025",
    },
    {
      title: "Pedidos de Compra Automatizados",
      description:
        "Crie automaticamente pedidos de compra quando o estoque atingir um nível crítico e notifique os fornecedores.",
      benefits:
        "Simplifica a cadeia de suprimentos, reduz o esforço manual e minimiza o risco de falta de estoque.",
      useCases:
        "Configure gatilhos automáticos de pedidos para produtos de alta demanda para evitar atrasos.",
      status: 15,
      timeframe: "Q2 2025",
    },
    {
      title: "Versão para App Móvel",
      description:
        "Desenvolva um aplicativo para Android e iOS para gestão de estoque em movimento.",
      benefits:
        "Permite que os usuários gerenciem estoque, acompanhem vendas e recebam alertas de qualquer lugar.",
      useCases:
        "Atualize estoque, visualize análises e receba notificações diretamente no aplicativo móvel.",
      status: 0,
      timeframe: "2026",
    },
    {
      title: "Portal de Fornecedores",
      description:
        "Permita que os fornecedores gerenciem pedidos, atualizem prazos de entrega e visualizem métricas de desempenho.",
      benefits:
        "Melhora a comunicação e a coordenação com fornecedores, reduzindo erros e atrasos de pedidos.",
      useCases:
        "Fornecedores podem confirmar pedidos, atualizar status de estoque e gerenciar faturas via portal.",
      status: 0,
      timeframe: "2026",
    },
  ];

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageContainer
      title="Roadmap de Futuras Funcionalidades"
      description="Explore os novos recursos emocionantes que estão chegando à Stockify"
    >
      <Grid container spacing={isSmallScreen ? 2 : 4}>
        <Grid size={{ sm: 12 }}>
          <DashboardCard title="Roadmap de Futuras Funcionalidades">
            <Typography variant="body1" paragraph align="center">
              Na Stockify, estamos sempre em busca de melhorar a experiência de
              gerenciamento de estoque. Aqui está uma prévia dos próximos
              recursos e melhorias que estamos desenvolvendo para você!
            </Typography>

            <Grid container spacing={isSmallScreen ? 2 : 4}>
              {futureFeatures.map((feature, index) => (
                <Grid key={index} size={{ xs: 12, sm: 12, md: 6 }}>
                  <BlankCard
                    sx={{ mb: 2, borderRadius: 2, overflow: "hidden" }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="h5" gutterBottom>
                          {feature.title}
                        </Typography>
                      </Box>

                      <Chip
                        label={`Previsão: ${feature.timeframe}`}
                        color="primary"
                        sx={{ mb: 2 }}
                      />

                      <Typography variant="body1" paragraph>
                        {feature.description}
                      </Typography>

                      <Divider sx={{ mb: 2 }} />

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Benefícios:</strong> {feature.benefits}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1 }}
                      >
                        <strong>Casos de Uso:</strong> {feature.useCases}
                      </Typography>

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          <strong>Progresso do Desenvolvimento:</strong>
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={feature.status}
                          sx={{ height: 10, borderRadius: 5, mt: 1 }}
                        />
                        <Typography variant="body2" align="center">
                          {feature.status}% Completo
                        </Typography>
                      </Box>
                    </CardContent>
                  </BlankCard>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="h6" gutterBottom>
                Deixe seu Feedback
              </Typography>
              <Typography variant="body2" paragraph>
                Quer sugerir algo ou ver um recurso específico? Entre em contato
                e compartilhe suas ideias conosco!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => alert("Formulário de feedback em breve!")}
                sx={{ mt: 2 }}
              >
                Enviar Feedback
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Roadmap;
