import { Typography, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageContainer from "../../../components/container/PageContainer.jsx";
import BlankCard from "../../../components/shared/BlankCard.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
const AboutUs = () => {
  return (
    <PageContainer title="Sobre Nós" description="Informações sobre a Stockify">
      <Grid container spacing={3}>
        <Grid size={{ sm: 12 }}>
          <DashboardCard title="Sobre Nós">
            <Grid container spacing={3}>
              <Grid size={{ sm: 12 }}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h5">Stockify</Typography>
                    <Typography variant="body1">
                      Stockify é um sistema de gerenciamento de estoque online
                      desenvolvido para otimizar e automatizar a gestão de
                      produtos e vendas em e-commerce. Nosso objetivo é
                      proporcionar uma solução eficiente, moderna e segura,
                      utilizando tecnologias de ponta como Spring Boot, React e
                      PostgreSQL.
                    </Typography>
                  </CardContent>
                </BlankCard>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default AboutUs;
