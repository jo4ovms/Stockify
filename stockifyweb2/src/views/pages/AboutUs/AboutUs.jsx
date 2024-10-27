import { Typography, CardContent } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageContainer from "../../../components/container/PageContainer.jsx";
import BlankCard from "../../../components/shared/BlankCard.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";

const AboutUs = () => {
  return (
    <PageContainer
      title="Sobre Nós"
      description="Conheça mais sobre a Stockify"
    >
      <Grid container spacing={3}>
        <Grid size={{ sm: 12 }}>
          <DashboardCard title="Sobre Nós">
            <Grid container spacing={3}>
              <Grid size={{ sm: 12 }}>
                <BlankCard>
                  <CardContent>
                    <Typography variant="h4" gutterBottom align="center">
                      Bem-vindo à Stockify
                    </Typography>
                    <Typography variant="body1" paragraph>
                      A <strong>Stockify</strong> é uma plataforma completa de
                      <strong> gerenciamento de estoque</strong> projetada para
                      otimizar e automatizar as operações de e-commerce. Desde o
                      monitoramento do inventário até a gestão de vendas,
                      oferecemos uma solução intuitiva e poderosa para atender
                      às necessidades de negócios modernos.
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Fundada por um estudante em tecnologia e comércio virtual,
                      a Stockify tem como missão transformar o modo como os
                      negócios administram seus produtos, tornando o
                      gerenciamento de estoque mais <strong>eficiente</strong>,
                      <strong> seguro</strong>, e <strong>escalável</strong>.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Nossos Valores
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Valorizamos a <strong>inovação</strong>, o{" "}
                      <strong>compromisso com a excelência</strong>, e a{" "}
                      <strong>transparência</strong> em todas as interações.
                      Acreditamos que a tecnologia deve empoderar as empresas,
                      permitindo que elas se concentrem no que mais importa:
                      <strong> crescimento sustentável</strong> e{" "}
                      <strong>satisfação do cliente</strong>.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Tecnologia de Ponta
                    </Typography>
                    <Typography variant="body1" paragraph>
                      A Stockify é construída com as mais recentes tecnologias
                      do mercado:
                      <ul>
                        <li>
                          <strong>Backend:</strong> Spring Boot para um
                          desenvolvimento robusto e escalável.
                        </li>
                        <li>
                          <strong>Frontend:</strong> React para uma experiência
                          de usuário interativa e responsiva.
                        </li>
                        <li>
                          <strong>Banco de Dados:</strong> PostgreSQL para um
                          gerenciamento de dados confiável e seguro.
                        </li>
                      </ul>
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Nossa Visão
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Nossa visão é nos tornarmos a plataforma preferida de
                      gerenciamento de estoque para empresas de todos os
                      tamanhos, fornecendo soluções adaptáveis que evoluem com
                      as necessidades do mercado. Com foco constante em
                      inovação, estamos comprometidos em ajudar empresas a
                      crescerem de forma mais rápida e inteligente.
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                      Entre em Contato
                    </Typography>
                    <Typography variant="body1">
                      Se você deseja saber mais sobre como a Stockify pode
                      ajudar seu negócio ou tem dúvidas sobre nossos serviços,
                      entre em contato conosco. Estamos sempre prontos para
                      ajudar!
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
