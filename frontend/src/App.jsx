import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import "./App.css";
import Dashboard from "./pages/DashboardPage";
import Tournaments from "./pages/TournamentsPage";
import Matches from "./pages/MatchesPage";
import Participants from "./pages/ParticipantsPage";
import Users from "./pages/UsersPage";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import { AuthProvider } from "./guards/AuthContext";
import { Toaster } from 'react-hot-toast';
import CreateTournament from "./pages/CreateTournamentPage";
import TournamentMatches from "./pages/TournamentMatchesPage";

export default function App() {
  const isAuthenticated = localStorage.getItem("token"); // Check authentication status

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            element={
              isAuthenticated ? <AuthenticatedLayout /> : <Navigate to="/" />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/users" element={<Users />} />
            <Route
              path="/tournaments/:id/participants"
              element={<Participants />}
            />
            <Route
              path="/tournaments/create"
              element={<CreateTournament />}
            />
            <Route
              path="/tournaments/:id/matches"
              element={<TournamentMatches />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-center" reverseOrder={true} />
    </AuthProvider>
  );
}
