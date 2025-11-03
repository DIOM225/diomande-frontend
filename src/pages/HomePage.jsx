// 📄 src/pages/HomePage.jsx
import React from "react";
import "./HomePage.css";
import {
  FaHome,
  FaMapMarkerAlt,
  FaKey,
  FaShieldAlt,
  FaCreditCard,
  FaHeadset,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // ✅ Updated logic for "Gérer Mon Loyer"
  const handleLoyerClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const loyeRole = localStorage.getItem("loyeRole"); // renter | owner | manager

    if (!user) {
      // Not logged in → go to auth first
      navigate("/auth?redirect=/loye/dashboard");
      return;
    }

    // Logged in user → check Loye onboarding
    if (!loyeRole) {
      navigate("/loye/onboarding");
    } else {
      if (loyeRole === "renter") navigate("/loye/dashboard");
      else navigate("/loye/properties");
    }
  };

  return (
    <div className="homepage">
      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <h1>
              Parce qu’avant chaque investissement, il y a des années d’efforts.
            </h1>
            <p>
              Nous vous accompagnons avec des outils puissants pour reprendre le
              contrôle de vos projets immobiliers.
            </p>
            <div className="hero-buttons">
              <button className="btn outline" onClick={handleLoyerClick}>
                <FaKey /> Gérer Mon Loyer
              </button>
              <button className="btn primary">
                <FaMapMarkerAlt /> Acheter un terrain
              </button>
              <button className="btn secondary">
                <FaHome /> Acheter une maison
              </button>
            </div>
          </div>
        </section>

        {/* Service Cards */}
        <section className="services">
          <div className="card">
            <FaKey className="icon success" />
            <h3>Gérer Mon Loyer</h3>
            <p>
              Encaissez vos loyers en ligne et gérez vos locataires facilement
            </p>
            <button className="btn outline" onClick={handleLoyerClick}>
              Découvrir Loyer
            </button>
          </div>

          <div className="card">
            <FaMapMarkerAlt className="icon primary" />
            <h3>Acheter un terrain</h3>
            <p>Terrains vérifiés avec titres fonciers authentiques</p>
            <button className="btn outline">Parcourir les terrains</button>
          </div>

          <div className="card">
            <FaHome className="icon secondary" />
            <h3>Acheter une maison</h3>
            <p>Maisons neuves et de seconde main avec transactions sécurisées</p>
            <button className="btn outline">Voir les maisons</button>
          </div>
        </section>

        {/* Why Diomande */}
        <section className="why">
          <h2>Pourquoi choisir Diomande ?</h2>
          <p>
            Une plateforme moderne et sécurisée pour tous vos besoins
            immobiliers.
          </p>
          <div className="why-cards">
            <div>
              <FaShieldAlt className="icon success" />
              <h4>Titres vérifiés</h4>
              <p>
                Tous nos biens ont des titres fonciers authentiques et vérifiés
              </p>
            </div>
            <div>
              <FaCreditCard className="icon primary" />
              <h4>Paiements sécurisés</h4>
              <p>Transactions protégées avec Wave et CinetPay</p>
            </div>
            <div>
              <FaHeadset className="icon secondary" />
              <h4>Support réactif</h4>
              <p>
                Une équipe dédiée pour vous accompagner à chaque étape
              </p>
            </div>
          </div>
        </section>

        {/* Loye Promo Banner */}
        <section className="promo">
          <h2>Encaissez vos loyers en ligne – simple & sécurisé</h2>
          <p>
            Loyer simplifie la gestion locative pour propriétaires, gestionnaires
            et locataires.
          </p>
          <button className="btn light" onClick={handleLoyerClick}>
            <FaUsers /> Découvrir Loyer
          </button>
        </section>

        {/* Testimonials */}
        <section className="testimonials">
          <h2>Ce que disent nos clients</h2>
          <div className="testimonial-grid">
            <div className="testimonial">
              <FaCheckCircle className="icon primary" />
              <h4>Kouassi Marie</h4>
              <p className="role">Propriétaire</p>
              <p>
                “Grâce à L'application Diom225, je reçois mes loyers à temps chaque fin du mois.!”
              </p>
            </div>
            <div className="testimonial">
              <FaCheckCircle className="icon secondary" />
              <h4>Diabaté Ibrahim</h4>
              <p className="role">Acheteur</p>
              <p>
                “J’ai trouvé mon terrain idéal avec un titre foncier vérifié.
                Transaction transparente.”
              </p>
            </div>
            <div className="testimonial">
              <FaCheckCircle className="icon success" />
              <h4>Traoré Fatou</h4>
              <p className="role">Locataire</p>
              <p>
                “Payer mon loyer en ligne, c’est tellement pratique. Plus besoin
                de me déplacer !”
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3 className="logo">
              Diomande<span>.com</span>
            </h3>
            <p>Plateforme immobilière de confiance en Côte d'Ivoire</p>
            <p className="secure">
              <FaShieldAlt /> Paiements sécurisés
            </p>
          </div>

          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="/loye">Gérer mes biens (Loyer)</a>
              </li>
              <li>
                <a href="/land">Acheter un terrain</a>
              </li>
              <li>
                <a href="/home">Acheter une maison</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="/contact">Nous contacter</a>
              </li>
              <li>
                <a href="/privacy">Confidentialité</a>
              </li>
              <li>
                <a href="/terms">Conditions d'utilisation</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Recevez les dernières offres immobilières</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Votre email" />
              <button type="submit" className="btn primary">
                S’inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Diomande.com. Tous droits réservés.</p>
          <div className="contact-info">
            <span>📞 +225 XX XX XX XX</span>
            <span>✉️ contact@diomande.com</span>
            <span>💬 WhatsApp</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
