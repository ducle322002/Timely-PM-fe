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
          path: route.manage,
          element: <ManagePage />,
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
