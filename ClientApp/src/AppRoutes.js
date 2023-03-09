import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { DatabaseDemo } from "./components/DatabaseDemo";

// User authentication
import { LoginPage } from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
  },
  {
    path: '/databasedemo',
    element: <DatabaseDemo />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/registration',
    element: <RegistrationPage />
  }
];

export default AppRoutes;
