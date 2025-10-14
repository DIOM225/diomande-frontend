import { useState } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaPhone, FaLock, FaEye, FaEyeSlash, FaBirthdayCake } from "react-icons/fa";

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    birthday: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let cleanValue = value;
    if (name === "phone") cleanValue = value.replace(/\D/g, "");
    setForm((prev) => ({ ...prev, [name]: cleanValue }));
    setError("");
  };

  const saveAndRedirect = (res) => {
    const { token, user, loyeUnitCode } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    const roleFromLoye = res.data?.user?.loye?.role;
    if (roleFromLoye) localStorage.setItem("loyeRole", roleFromLoye);
    else localStorage.removeItem("loyeRole");

    if (loyeUnitCode) localStorage.setItem("loye.unitCode", loyeUnitCode);
    else localStorage.removeItem("loye.unitCode");

    navigate("/");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedPhone = form.phone.replace(/\D/g, "");

    if (!isLogin && (cleanedPhone.length !== 8 && cleanedPhone.length !== 10)) {
      setError("Le numéro de téléphone doit contenir 8 ou 10 chiffres.");
      return;
    }

    if (!isLogin && form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    const endpoint = isLogin
      ? `${import.meta.env.VITE_API_URL}/api/auth/login`
      : `${import.meta.env.VITE_API_URL}/api/auth/register`;

    try {
      setLoading(true);

      const payload = isLogin
        ? { identifier: form.identifier.trim(), password: form.password }
        : {
            name: form.name,
            phone: cleanedPhone,
            birthday: form.birthday,
            password: form.password,
          };

      const res = await axios.post(endpoint, payload);
      saveAndRedirect(res);
    } catch (err) {
      const msg = err.response?.data?.message || "Une erreur est survenue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* 🔒 Icon header */}
        <div style={styles.iconCircle}>
          <FaLock color="#ff6a00" size={28} />
        </div>

        <h2 style={styles.title}>{isLogin ? "Connexion" : "Inscription"}</h2>
        <p style={styles.subtitle}>
          {isLogin
            ? "Accédez à votre espace personnel"
            : "Créez votre compte en quelques secondes"}
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin ? (
            <>
              {/* Nom */}
              <div style={styles.inputGroup}>
                <FaUser style={styles.icon} />
                <input
                  type="text"
                  name="name"
                  placeholder="Nom complet"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              {/* Téléphone */}
              <div style={styles.inputGroup}>
                <FaPhone style={styles.icon} />
                <input
                  type="text"
                  name="phone"
                  placeholder="Téléphone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  maxLength={10}
                  style={styles.input}
                />
              </div>

              {/* Date de naissance */}
              <div style={styles.inputGroup}>
                <FaBirthdayCake style={styles.icon} />
                <input
                  type="date"
                  name="birthday"
                  placeholder="Date de naissance"
                  value={form.birthday}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              {/* Mot de passe */}
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span
                  onClick={() => setShowPassword((s) => !s)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirmation */}
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmez le mot de passe"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span
                  onClick={() => setShowConfirm((s) => !s)}
                  style={styles.eyeIcon}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </>
          ) : (
            <>
              {/* Téléphone / Email */}
              <div style={styles.inputGroup}>
                <FaPhone style={styles.icon} />
                <input
                  type="text"
                  name="identifier"
                  placeholder="Téléphone ou Email"
                  value={form.identifier}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              {/* Mot de passe */}
              <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
                <span
                  onClick={() => setShowPassword((s) => !s)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading
              ? "Chargement..."
              : isLogin
              ? "Se connecter"
              : "S’inscrire"}
          </button>

          <p style={styles.switchText}>
            {isLogin ? "Pas de compte ?" : "Déjà un compte ?"}{" "}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              style={styles.switchLink}
            >
              {isLogin ? "Inscription" : "Connexion"}
            </span>
          </p>

          {isLogin && (
            <Link to="/reset-password" style={styles.resetLink}>
              🔁 Mot de passe oublié ?
            </Link>
          )}
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  card: {
    background: "#fff",
    padding: "2.5rem 2rem",
    borderRadius: "16px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.07)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  iconCircle: {
    width: "64px",
    height: "64px",
    backgroundColor: "#fff4eb",
    borderRadius: "50%",
    margin: "0 auto 1.2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#111827",
    marginBottom: "0.3rem",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
  },
  form: { display: "flex", flexDirection: "column", gap: "1rem" },
  inputGroup: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: "10px",
    padding: "0.5rem 1rem",
  },
  icon: {
    marginRight: "0.6rem",
    color: "#9ca3af",
    fontSize: "1rem",
  },
  input: {
    border: "none",
    background: "transparent",
    outline: "none",
    width: "100%",
    fontSize: "1rem",
    color: "#111827",
  },
  eyeIcon: {
    position: "absolute",
    right: "1rem",
    cursor: "pointer",
    color: "#9ca3af",
  },
  button: {
    backgroundColor: "#ff6a00",
    color: "#fff",
    padding: "0.85rem",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "0.3rem",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
    marginTop: "-0.3rem",
  },
  switchText: {
    marginTop: "1.3rem",
    fontSize: "0.9rem",
    color: "#374151",
  },
  switchLink: {
    color: "#ff6a00",
    fontWeight: "600",
    cursor: "pointer",
  },
  resetLink: {
    display: "block",
    marginTop: "0.8rem",
    fontSize: "0.9rem",
    color: "#007bff",
    textDecoration: "underline",
  },
};

export default AuthPage;
