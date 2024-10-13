import {
  IconAperture,
  IconLayoutDashboard,
  IconInfoCircle,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    navlabel: true,
    subheader: "Controle",
  },
  {
    id: uniqueId(),
    title: "Fornecedores",
    icon: IconAperture,
    href: "/supplier",
  },

  {
    id: uniqueId(),
    title: "Produtos",
    icon: IconAperture,
    href: "/stock",
  },

  {
    id: uniqueId(),
    title: "Relatórios",
    icon: IconAperture,
    href: "/report-logs",
  },
  {
    id: uniqueId(),
    title: "Registrar Venda",
    icon: IconAperture,
    href: "/sales",
  },
  {
    navlabel: true,
    subheader: "Contato",
  },
  {
    id: uniqueId(),
    title: "Sobre nós",
    icon: IconInfoCircle,
    href: "/about-us",
  },
  {
    id: uniqueId(),
    title: "Entrar em contato",
    icon: IconInfoCircle,
    href: "/contact-us",
  },
];

export default Menuitems;
