import {
  Avatar,
  Box,
  Menu,
  Button,
  MenuItem,
  IconButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { IconUser } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const navigate = useNavigate();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    //authservice.logout()
    navigate("/login");
    window.location.reload();
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="msgs"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          //src={ProfileImg}
          alt="Profile"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>Perfil</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
          >
            Desconectar
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
