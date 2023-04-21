import { Counter } from "./components/Counter";
import { AboutUs } from "./components/AboutUs";
import { TestAccessControl } from "./components/TestAccessControl";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import HelpPage from "./components/HelpPage/HelpPage";
import ItemUpdatePage from './components/ItemUpdatePage/ItemUpdatePage';
import ProfilePage from "./components/ProfilePage/ProfilePage";
import HomePage from "./components/HomePage/HomePage";

// User authentication
import { LoginPage } from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import { ItemViewPage } from "./components/ItemViewPage/ItemViewPage";

import ItemCreationPage from "./components/ItemCreation/ItemCreationPage";
const AppRoutes = [
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/about-us',
    element: <AboutUs />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    index: true,
    element: <HomePage />
  },
  {
    path: '/register',
    element: <RegistrationPage />
  },
  {
  path: '/forgotpassword',
  element: <ForgotPasswordPage />
  },
  {
  path: '/help',
  element: <HelpPage />
  },
  {
    path: '/testaccesscontrol',
    element: <TestAccessControl />
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/forgotpassword',
    element: <ForgotPasswordPage />
  },
  {
      path: '/skelbimas/:itemId',
      element: <ItemViewPage />
  },
  {
      path: '/skelbimas/redaguoti/:itemId',
      element: <ItemUpdatePage />
  },
  {
      path: '/skelbimas/naujas',
      element: <ItemCreationPage />
  },
  }
];

export default AppRoutes;
