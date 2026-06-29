import { createBrowserRouter } from "react-router";
import { HomePage } from "./components/HomePage";
import { EServicesPage } from "./components/EServicesPage";
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
import { PrestationsPage } from "./components/PrestationsPage";
import { PrestationDetailPage } from "./components/PrestationDetailPage";
import { ActualitesPage } from "./components/ActualitesPage";
import { ActualiteDetailPage } from "./components/ActualiteDetailPage";
import { AgencesPage } from "./components/AgencesPage";
import { SearchResults } from "./components/SearchResults";
import { ContactPage } from "./components/ContactPage";
import {
  AgentImmatriculationDashboard,
  AgentCotisationDashboard,
  AgentPrestationsDashboard,
  AgentSupportDashboard,
  AdminDashboardPage,
} from "./components/agent";

export const router = createBrowserRouter([
  { path: "/",                          Component: HomePage },
  { path: "/home",                      Component: HomePage },
  { path: "/presentations",             Component: PresentationPage },
  { path: "/prestations",               Component: PrestationsPage },
  { path: "/prestations/:id",           Component: PrestationDetailPage },
  { path: "/actualites",                Component: ActualitesPage },
  { path: "/actualites/:id",            Component: ActualiteDetailPage },
  { path: "/agences",                   Component: AgencesPage },
  { path: "/search",                    Component: SearchResults },
  { path: "/contact",                   Component: ContactPage },
  { path: "/e-services",                Component: EServicesPage },
  { path: "/connexion",                 Component: LoginPage },
  { path: "/inscription",               Component: SignupPage },
  { path: "/creer-compte",              Component: CreateAccountPage },
  { path: "/mot-de-passe-oublie",       Component: ForgotPasswordPage },
  { path: "/modifier-mot-de-passe",     Component: ResetPasswordPage },
  { path: "/employeur/tableau-de-bord", Component: EmployeurDashboard },
  { path: "/employeur/declarer-travailleur", Component: DeclarerTravailleurPage },
  { path: "/employeur/parametres",      Component: ParametresPage },
  { path: "/employeur/notifications",   Component: NotificationsPage },
  { path: "/travailleur/tableau-de-bord", Component: TravailleurDashboard },
  { path: "/travailleur/parametres",    Component: ParametresPage },
  { path: "/travailleur/notifications", Component: NotificationsPage },
  { path: "/agent/immatriculation",     Component: AgentImmatriculationDashboard },
  { path: "/agent/notifications",       Component: NotificationsPage },
  { path: "/agent/parametres",          Component: ParametresPage },
  { path: "/agent/cotisation",          Component: AgentCotisationDashboard },
  { path: "/agent/prestations",         Component: AgentPrestationsDashboard },
  { path: "/agent/support",             Component: AgentSupportDashboard },
  { path: "/admin",                     Component: AdminDashboardPage },
]);