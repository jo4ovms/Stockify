import {
  ListItemIcon,
  List,
  styled,
  ListItemText,
  ListItemButton,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

const NavItem = ({ item, level, pathDirect, onClick = () => {} }) => {
  const Icon = item.icon;
  const theme = useTheme();
  const itemIcon = <Icon stroke={1.5} size="1.3rem" />;

  const ListItemStyled = styled(ListItemButton)(() => ({
    whiteSpace: "nowrap",
    marginBottom: "2px",
    padding: "8px 10px",
    borderRadius: "8px",
    backgroundColor: level > 1 ? "transparent !important" : "inherit",
    color: theme.palette.text.secondary,
    paddingLeft: "10px",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    "&.Mui-selected": {
      color: "white",
      backgroundColor: theme.palette.primary.main,
      "&:hover": {
        backgroundColor: theme.palette.primary.main,
        color: "white",
      },
    },
  }));

  return (
    <List component="li" disablePadding key={item.id}>
      <ListItemStyled
        component={item.external ? "a" : NavLink}
        to={item.href}
        href={item.external ? item.href : ""}
        disabled={item.disabled}
        selected={pathDirect === item.href}
        target={item.external ? "_blank" : ""}
        onClick={(e) => {
          onClick(e);
          window.scrollTo(0, 0);
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: "36px",
            p: "3px 0",
            color: "inherit",
          }}
        >
          {itemIcon}
        </ListItemIcon>
        <ListItemText>
          <>{item.title}</>
        </ListItemText>
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  pathDirect: PropTypes.any,
  onClick: PropTypes.func,
};

export default NavItem;
