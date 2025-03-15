import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import UserLayout from "./layouts/UserLayout/UserLayout";
import Homepage from "./pages/Homepage/Homepage";
import ManagePage from "./pages/ManagePage/ManagePage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import { route } from "./routes";

function App() {
  const router = createBrowserRouter([
    {
      path: route.welcome,
      element: <WelcomePage />,
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
