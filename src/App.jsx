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
import BoardPage from "./pages/BoardPage/BoardPage";
import SettingProjectPage from "./pages/SettingProjectPage/SettingProjectPage";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import ManageUser from "./pages/AdminPage/ManageUser/ManageUser";
import Dashboard from "./pages/AdminPage/Dashboard/Dashboard";
import ProjectStatistic from "./pages/AdminPage/ProjectStatistic/ProjectStatistic";
import NewsManagement from "./pages/AdminPage/NewsManagement/NewsManagement";
import IssueProjectPage from "./pages/IssueProjectPage/IssueProjectPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogDetailPage from "./pages/BlogDetailPage/BlogDetailPage";
import OTPLoginPage from "./pages/OTPLoginPage/OTPLoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProjectLogHistory from "./pages/ProjectLogHistory/ProjectLogHistory";
import DetailPage from "./pages/DetailPage/DetailPage";
import SummaryProjectPage from "./pages/SummaryProjectPage/SummaryProjectPage";
import Feedback from "./pages/AdminPage/Feedback/Feedback";
import ForgotPasswordPage from "./pages/ForgotPasswordPage/ForgotPasswordPage";
import ChangeForgetPassword from "./pages/ChangeForgetPassword/ChangeForgetPassword";
import ProjectDocument from "./pages/ProjectDocument/ProjectDocument";
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
          path: `${route.otpPage}/:email`,
          element: <OTPLoginPage />,
        },
        {
          path: route.register,
          element: <RegisterPage />,
        },
        {
          path: route.verifyEmail,
          element: <EmailVerifiedPage />,
        },
        {
          path: route.blog,
          element: <BlogPage />,
        },
        {
          path: route.blogDetail,
          element: <BlogDetailPage />,
        },

        {
          path: route.forgotPassword,
          element: <ForgotPasswordPage />,
        },
        {
          path: `${route.changeForgetPassword}`,
          element: <ChangeForgetPassword />,
        },
      ],
    },
    {
      path: route.home,
      element: (
        <ProtectedRoute roles={["USER"]}>
          <UserLayout />
        </ProtectedRoute>
      ),

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
      element: (
        <ProtectedRoute roles={["USER"]}>
          <ProjectLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: `${route.workspace}/${route.project}/:id`,
          element: <ProjectDetailPage />,
        },
        {
          path: route.userProfile,
          element: <UserProfilePage />,
        },
        {
          path: `${route.workspace}/${route.project}/:id/${route.board}`,
          element: <BoardPage />,
        },
        {
          path: `${route.workspace}/${route.project}/:id/${route.projectSetting}`,
          element: <SettingProjectPage />,
        },
        {
          path: `${route.workspace}/${route.project}/:id/${route.projectIssue}`,
          element: <IssueProjectPage />,
        },
        {
          path: `${route.workspace}/${route.project}/:id/${route.projectHistory}`,
          element: <ProjectLogHistory />,
        },
        {
          path: `${route.workspace}/${route.project}/:id/task-detail/:taskId`,
          element: <DetailPage />,
        },
        {
          path: `${route.workspace}/${route.project}/:id/project-documents`,
          element: <ProjectDocument />,
        },

        {
          path: `${route.workspace}/${route.project}/:id/summary`,
          element: <SummaryProjectPage />,
        },
      ],
    },

    {
      path: route.admin,
      element: (
        <ProtectedRoute roles={["ADMIN"]}>
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          path: route.dashboard,
          element: <Dashboard />,
        },
        {
          path: route.adminUser,
          element: <ManageUser />,
        },
        {
          path: route.projectStatistic,
          element: <ProjectStatistic />,
        },
        {
          path: route.newsManagement,
          element: <NewsManagement />,
        },
        {
          path: route.feedbackManage,
          element: <Feedback />,
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
