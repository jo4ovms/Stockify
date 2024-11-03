import {
  IconAperture,
  IconLayoutDashboard,
  IconInfoCircle,
  IconReload,
  IconShoppingCartFilled,
  IconClipboardText,
  IconUserPlus,
  IconShoppingBagPlus,
  IconStack3Filled,
  IconAlertCircle,
  IconAlertCircleFilled,
  IconAlertTriangleFilled,
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
    icon: IconUserPlus,
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
    icon: IconClipboardText,
    href: "/report-logs",
  },
  {
    id: uniqueId(),
    title: "Registrar Venda",
    icon: IconShoppingBagPlus,
    href: "/register-sale",
  },
  {
    id: uniqueId(),
    title: "Vendas",
    icon: IconShoppingCartFilled,
    href: "/sold-items",
  },
  {
    navlabel: true,
    subheader: "Estoque",
  },

  {
    id: uniqueId(),
    title: "Estoque Suficiente",
    icon: IconStack3Filled,
    href: "/stock/safety",
  },
  {
    id: uniqueId(),
    title: "Em Baixo Estoque",
    icon: IconAlertCircle,
    href: "/stock/under-safety",
  },
  {
    id: uniqueId(),
    title: "Estoque Crítico",
    icon: IconAlertCircleFilled,
    href: "/stock/critical-stock",
  },

  {
    id: uniqueId(),
    title: "Esgotado",
    icon: IconAlertTriangleFilled,
    href: "/stock/out-of-stock",
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
    title: "Futuras Atualizações",
    icon: IconReload,
    href: "/roadmap",
  },
];

export default Menuitems;
