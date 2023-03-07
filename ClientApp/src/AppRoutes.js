import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import { Home } from "./components/Home";
import { DatabaseDemo } from "./components/DatabaseDemo";
import { LoginPage } from "./components/LoginPage/LoginPage";

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
  }
];

export default AppRoutes;
