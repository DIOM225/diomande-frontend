import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 1024px)").matches);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // 🧩 Watch for login/logout changes (localStorage sync)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const updatedUser = JSON.parse(localStorage.getItem("user"));
        setUser(updatedUser || null);
      } catch {
        setUser(null);
      }
    };

    // ✅ Listen for storage or tab changes
    window.addEventListener("storage", handleStorageChange);
    // ✅ Also re-check when route changes (e.g., after login redirect)
    handleStorageChange();

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("loyeRole");
    setUser(null);
    navigate("/");
    window.location.reload(); // ✅ ensure full header refresh
  };

  // 🔹 Responsive behavior
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    const handleResize = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleResize);
    return () => mediaQuery.removeEventListener("change", handleResize);
  }, []);

  // 🔹 Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const renderLinks = () => (
    <>
      <Link to="/loye" onClick={() => setIsMobileMenuOpen(false)}>
        Loyer
      </Link>
      <Link to="/land" onClick={() => setIsMobileMenuOpen(false)}>
        Terrains
      </Link>
      <Link to="/home" onClick={() => setIsMobileMenuOpen(false)}>
        Maisons
      </Link>

      {user ? (
        <button
          onClick={() => {
            handleLogout();
            setIsMobileMenuOpen(false);
          }}
          className="logout-btn"
        >
          Déconnexion
        </button>
      ) : (
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

      {!isMobile && <nav className="nav desktop-links">{renderLinks()}</nav>}

      {isMobile && (
        <button
          ref={buttonRef}
          className="mobile-menu-icon"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      )}

      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu" ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <span className="close-icon" onClick={() => setIsMobileMenuOpen(false)}>
              ✕
            </span>
            {renderLinks()}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
