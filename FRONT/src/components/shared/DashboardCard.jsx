import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import PropTypes from "prop-types";
const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  footer,
  cardheading,
  headtitle,
  headsubtitle,
  middlecontent,
  sx,
}) => {
  return (
    <Card sx={{ padding: 0, ...sx }} elevation={9} variant={undefined}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "30px" }}>
          {title ? (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems={"center"}
              mb={3}
            >
              <Box>
                {title ? <Typography variant="h5">{title}</Typography> : ""}

                {subtitle ? (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                ) : (
                  ""
                )}
              </Box>
              {action}
            </Stack>
          ) : null}

          {children}
        </CardContent>
      )}

      {middlecontent}
      {footer}
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
  footer: PropTypes.node,
  cardheading: PropTypes.bool,
  headtitle: PropTypes.string,
  headsubtitle: PropTypes.string,
  middlecontent: PropTypes.node,
  sx: PropTypes.object,
};

export default DashboardCard;
