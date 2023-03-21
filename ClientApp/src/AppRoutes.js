import { Counter } from "./components/Counter";
import { Home } from "./components/Home";
import { AboutUs } from "./components/AboutUs";

// User authentication
import { LoginPage } from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";

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
  }
];

export default AppRoutes;
