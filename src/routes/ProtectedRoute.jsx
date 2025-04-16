import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { route } from "./index"; // Adjust the import path if needed
import PropTypes from "prop-types";
import { selectUser } from "../redux/features/userSlice";

const ProtectedRoute = ({ children, roles = [] }) => {
  const user = useSelector(selectUser);

  // Check if the user is not logged in or doesn't have a role
  if (!user || typeof user.role !== "string") {
    return <Navigate to={route.login} />;
  }

  // Ensure roles is an array and check if the user's role is in the allowed roles array
  if (!Array.isArray(roles) || !roles.includes(user.role)) {
    return <Navigate to={route.welcome} />;
  }

  // If user has the required role, render the children components
  return children;
};

// Define PropTypes for type checking
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string), // Updated to array of strings
};

export default ProtectedRoute;
