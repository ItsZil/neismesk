import { Counter } from "./components/Counter";
import { AboutUs } from "./components/AboutUs";
import { TestAccessControl } from "./components/TestAccessControl";
import ForgotPasswordPage from "./components/ForgotPasswordPage/ForgotPasswordPage";
import HelpPage from "./components/HelpPage/HelpPage";
import ItemUpdatePage from './components/ItemUpdatePage/ItemUpdatePage';
import ProfilePage from "./components/ProfilePage/ProfilePage";
import HomePage from "./components/HomePage/HomePage";
import SearchResultsPage  from "./components/SearchResultsPage/SearchResultsPage";
import SearchResultsByCategoryPage  from "./components/SearchResultsByCategoryPage/SearchResultsByCategoryPage";
import ChangePasswordPage from "./components/ChangePasswordPage/ChangePasswordPage";
import VerifyEmailPage from "./components/VerifyEmailPage/VerifyEmailPage";

// User authentication
import { LoginPage } from "./components/LoginPage/LoginPage";
import RegistrationPage from "./components/RegistrationPage/RegistrationPage";
import { ItemViewPage } from "./components/ItemViewPage/ItemViewPage";
import { DetailedItemInfoPage } from "./components/DetailedItemInfoPage/DetailedItemInfoPage";

import ItemCreationPage from "./components/ItemCreation/ItemCreationPage";
const AppRoutes = [
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/apie-mus',
    element: <AboutUs />
  },
  {
    path: '/prisijungimas',
    element: <LoginPage />
  },
  {
    index: true,
    element: <HomePage />
  },
  {
    path: '/registracija',
    element: <RegistrationPage />
  },
  {
  path: '/pamirsau-slaptazodi',
  element: <ForgotPasswordPage />
  },
  {
  path: '/pagalba',
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
    path: '/pamirsau-slaptazodi',
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
  {
      path: '/detaileditem/:itemId',
      element: <DetailedItemInfoPage />
  },
  {
    path: '/search/:searchQuery',
    element: <SearchResultsPage />
  },
  {
    path: '/search/category/:categoryId',
    element: <SearchResultsByCategoryPage />
  },
  {
    path: '/changepassword',
    element: <ChangePasswordPage />
  },
  {
      path: '/verifyemail',
      element: <VerifyEmailPage />
  }
];

export default AppRoutes;
