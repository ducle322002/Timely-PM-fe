import "./App.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import ManagePage from "./pages/ManagePage/ManagePage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import { route } from "./routes";
import GuestLayout from "./layouts/GuestLayout/GuestLayout";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import EmailVerifiedPage from "./pages/EmailVerifiedPage/EmailVerifyPage";
import IntroWorkspacePage from "./pages/IntroWorkspacePage/IntroWorkspacePage";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage";
import ProjectLayout from "./layouts/ProjectLayout/ProjectLayout";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import SettingPage from "./pages/SettingPage/SettingPage";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const router = createBrowserRouter([
    {
      path: route.welcome,
      element: <GuestLayout />,
      children: [
        {
          index: true,
          element: <WelcomePage />,
        },
        {
          path: route.login,
          element: <LoginPage />,
        },
        {
          path: route.register,
          element: <RegisterPage />,
        },
        {
          path: route.verifyEmail,
          element: <EmailVerifiedPage />,
        },
      ],
    },
    {
      path: route.home,
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: route.introWorkspace,
          element: <IntroWorkspacePage />,
        },
        {
          path: route.userProfile,
          element: <UserProfilePage />,
        },
        {
          path: route.setting,
          element: <SettingPage />,
        },
      ],
    },

    {
      path: route.workspace,
      element: <ProjectLayout />,
      children: [
        {
          path: `${route.workspace}/${route.project}/:id`,
          element: <ProjectDetailPage />,
        },
        {
          path: route.userProfile,
          element: <UserProfilePage />,
        },
      ],
    },

    {
      path: "*",
      element: <Navigate to={route.welcome} />,
    },
  ]);
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
