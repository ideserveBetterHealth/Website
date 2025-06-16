import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AboutUs from "./pages/AboutUs";
import Cosmetology from "./pages/Cosmetology";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MentalHealth from "./pages/MentalHealth";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import FinancialAid from "./pages/FinancialAid";
import Services from "./pages/Services";

const routes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "services",
    element: <Services />,
  },
  {
    path: "about-us",
    element: <AboutUs />,
  },
  {
    path: "mental-health",
    element: <MentalHealth />,
  },
  {
    path: "cosmetology",
    element: <Cosmetology />,
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
  },
  {
    path: "terms-conditions",
    element: <TermsConditions />,
  },
  {
    path: "financial-aid",
    element: <FinancialAid />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
]);
