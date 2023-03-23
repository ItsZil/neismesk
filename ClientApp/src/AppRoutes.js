import { Counter } from "./components/Counter";
import { Home } from "./components/Home";
import { AboutUs } from "./components/AboutUs";
import { TestAccessControl } from "./components/TestAccessControl";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import HelpPage from "./components/HelpPage/HelpPage";

// User authentication
import { LoginPage } from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import ItemCreationPage from "./components/ItemCreation/ItemCreationPage";
const AppRoutes = [
  {
    //index: true, //nustato startini page'a
    element: <Home />
  },
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
    element: <LoginPage />
  },
  {
    path: '/registration',
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
    path: '/forgotpassword',
    element: <ForgotPasswordPage />
  },
  {
    path: '/item-creation',
    element: <ItemCreationPage />
  }
];

export default AppRoutes;
