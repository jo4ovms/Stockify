import React from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

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
    <Card sx={{ ...sx, width: "100%" }} elevation={9}>
      {cardheading ? (
        <CardContent>
          <Typography variant="h5">{headtitle}</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {headsubtitle}
          </Typography>
        </CardContent>
      ) : (
        <CardContent sx={{ p: "30px" }}>
          {title && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Box>
                <Typography variant="h5">{title}</Typography>
                {subtitle && (
                  <Typography variant="subtitle2" color="textSecondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
              {action}
            </Stack>
          )}
          {children}
        </CardContent>
      )}
      {middlecontent}
      {footer}
    </Card>
  );
};

export default DashboardCard;
