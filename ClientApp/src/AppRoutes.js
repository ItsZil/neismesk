import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { RegistrationPage } from "./components/RegistrationPage/RegistrationPage";
import { DatabaseDemo } from "./components/DatabaseDemo";

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
    path: '/registration',
    element: <RegistrationPage />
  }
];

export default AppRoutes;
