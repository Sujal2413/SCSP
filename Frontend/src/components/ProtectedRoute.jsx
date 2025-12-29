import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useContext(AuthContext);
  if (!isAuthed) return <Navigate to="/login" replace />;
  return children;
}
