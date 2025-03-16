import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
      ],
    },

    {
      path: route.workspace,
      element: <UserLayout />,
      children: [
        {
          index: true,
          element: <Homepage />,
        },
        {
          path: `${route.workspace}/${route.project}/:id`,
          element: <ProjectDetailPage />,
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
