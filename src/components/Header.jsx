import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "./Header.css";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 1024px)").matches);

  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);

  // 🧩 Sync user state on storage or route changes
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const updatedUser = JSON.parse(localStorage.getItem("user"));
        setUser(updatedUser || null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location.pathname]);

  // 🧩 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loyeRole");
    setUser(null);
    navigate("/");
    window.location.reload();
  };

  // 🧩 Handle screen resize
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // 🧩 Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) &&
        e.target.closest(".profile-btn") == null
      ) {
        setIsProfileMenuOpen(false);
      }
      if (isMobileMenuOpen && !e.target.closest(".mobile-menu") && !e.target.closest(".mobile-menu-icon")) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // 🧭 Shared Links
  const renderLinks = () => (
    <>
      <Link to="/loye" onClick={() => setIsMobileMenuOpen(false)}>Loyer</Link>
      <Link to="/land" onClick={() => setIsMobileMenuOpen(false)}>Terrains</Link>
      <Link to="/home" onClick={() => setIsMobileMenuOpen(false)}>Maisons</Link>

      {/* 👑 Admin option for mobile */}
      {user?.role === "admin" && (
        <Link to="/admin/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          Admin
        </Link>
      )}

      {user && (
        <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Profil</Link>
      )}
      {!user && (
        <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
          Connexion / Inscription
        </Link>
      )}
    </>
  );

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/")}>
        Diomande<span>.com</span>
      </div>

      {/* Desktop navigation */}
      {!isMobile && (
        <nav className="nav desktop-links">
          <Link to="/loye">Loyer</Link>
          <Link to="/land">Terrains</Link>
          <Link to="/home">Maisons</Link>

          {user ? (
            <div className="profile-container" ref={profileMenuRef}>
              <button
                className="profile-btn"
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                aria-label="Profil menu"
              >
                {user?.profilePic ? (
                  <img src={user.profilePic} alt="avatar" className="avatar-img" />
                ) : (
                  <FaUserCircle size={28} color="#333" />
                )}
                {user?.role === "admin" && <span className="admin-badge">Admin</span>}
              </button>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <Link to="/profile" onClick={() => setIsProfileMenuOpen(false)}>
                    Mon Profil
                  </Link>

                  {/* 👑 Admin link (desktop dropdown) */}
                  {user?.role === "admin" && (
                    <Link to="/admin/dashboard" onClick={() => setIsProfileMenuOpen(false)}>
                      Espace Admin
                    </Link>
                  )}

                  <button onClick={handleLogout}>Déconnexion</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth">Connexion / Inscription</Link>
          )}
        </nav>
      )}

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          className="mobile-menu-icon"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Menu"
        >
          ☰
        </button>
      )}

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <span className="close-icon" onClick={() => setIsMobileMenuOpen(false)}>✕</span>
            {renderLinks()}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="logout-btn"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
