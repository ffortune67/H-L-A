import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { Projects } from "./pages/Projects";
import { Partners } from "./pages/Partners";
import { Blog } from "./pages/Blog";
import { Contact } from "./pages/Contact";
import { Downloads } from "./pages/Downloads";
import { Donations } from "./pages/Donations";
import BankTransferConfirmation from "./pages/BankTransferConfirmation";
import MobileMoneyConfirmation from "./pages/MobileMoneyConfirmation";
import CardPaymentConfirmation from "./pages/CardPaymentConfirmation";
import AdminDashboard from "./pages/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "services", Component: Services },
      { path: "projects", Component: Projects },
      { path: "partners", Component: Partners },
      { path: "blog", Component: Blog },
      { path: "contact", Component: Contact },
      { path: "downloads", Component: Downloads },
      { path: "donations", Component: Donations },
      { path: "payment/bank-transfer/:contribution_id", Component: BankTransferConfirmation },
      { path: "payment/mobile-money/:contribution_id", Component: MobileMoneyConfirmation },
      { path: "payment/card/:contribution_id", Component: CardPaymentConfirmation },
      { path: "admin/dashboard", Component: AdminDashboard },
    ],
  },
]);
