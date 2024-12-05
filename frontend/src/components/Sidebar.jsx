import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/SidebarStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometerAlt,
  faTrophy,
  faFutbol,
  faRightFromBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../guards/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    navigate(0);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Menu</h2>
      <div className="d-flex flex-column justify-content-between h-90">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/dashboard" className="sidebar-link">
              <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/tournaments" className="sidebar-link">
              <FontAwesomeIcon icon={faTrophy} /> Tournaments
            </Link>
          </li>
          <li className="sidebar-item">
            <Link to="/matches" className="sidebar-link">
              <FontAwesomeIcon icon={faFutbol} />
              {userData && userData.roleId == 1 ? " Matches" : " My Matches"}
            </Link>
          </li>
          {userData && userData.roleId == 1 && (
            <li className="sidebar-item">
              <Link to="/users" className="sidebar-link">
                <FontAwesomeIcon icon={faUsers} /> Users
              </Link>
            </li>
          )}
        </ul>
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <span className="sidebar-link cursor-pointer" onClick={logout}>
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
