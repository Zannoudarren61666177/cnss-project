import { createBrowserRouter } from "react-router-dom";

import { HomePage } from "./components/HomePage";
import { PresentationPage } from "./components/PresentationPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { CreateAccountPage } from "./components/CreateAccountPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { ResetPasswordPage } from "./components/ResetPasswordPage";
import { EmployeurDashboard } from "./components/EmployeurDashboard";
import { DeclarerTravailleurPage } from "./components/DeclarerTravailleurPage";
import { TravailleurDashboard } from "./components/TravailleurDashboard";
import { ParametresPage } from "./components/ParametresPage";
import { NotificationsPage } from "./components/NotificationsPage";

import {
  AgentImmatriculationDashboard,
  AgentEmployeurDashboard,
  AgentCotisationDashboard,
  AgentPrestationsDashboard,
  AgentSupportDashboard,
  AdminDashboardPage,
} from "./components/AgentDashboard";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/home", Component: HomePage },
  { path: "/presentations", Component: PresentationPage },
  { path: "/connexion", Component: LoginPage },
  { path: "/inscription", Component: SignupPage },
  { path: "/creer-compte", Component: CreateAccountPage },
  { path: "/mot-de-passe-oublie", Component: ForgotPasswordPage },
  { path: "/modifier-mot-de-passe", Component: ResetPasswordPage },
  { path: "/employeur/tableau-de-bord", Component: EmployeurDashboard },
  { path: "/employeur/declarer-travailleur", Component: DeclarerTravailleurPage },
  { path: "/employeur/parametres", Component: ParametresPage },
  { path: "/employeur/notifications", Component: NotificationsPage },
  { path: "/travailleur/tableau-de-bord", Component: TravailleurDashboard },
  { path: "/agent/immatriculation", Component: AgentImmatriculationDashboard },
  { path: "/agent/employeur", Component: AgentEmployeurDashboard },
  { path: "/agent/cotisation", Component: AgentCotisationDashboard },
  { path: "/agent/prestations", Component: AgentPrestationsDashboard },
  { path: "/agent/support", Component: AgentSupportDashboard },
  { path: "/admin", Component: AdminDashboardPage },
]);