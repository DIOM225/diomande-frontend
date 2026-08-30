// 📄 src/pages/HomePage.jsx — Diomandé landing (redesign). All styles scoped under .dmx (see HomePage.css)
import React from "react";
import "./HomePage.css";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  // ✅ Kept exactly as before — the real Loye entry logic
  const handleLoyerClick = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const loyeRole = localStorage.getItem("loyeRole"); // renter | owner | manager

    if (!user) {
      navigate("/auth?redirect=/loye/dashboard");
      return;
    }
    if (!loyeRole) {
      navigate("/loye/onboarding");
    } else {
      if (loyeRole === "renter") navigate("/loye/dashboard");
      else navigate("/loye/properties");
    }
  };

  const goAuth = () => navigate("/auth");

  return (
    <div className="dmx">
      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="wrap">
          <div className="hero-copy">
            <div className="route">
              <span>Paris</span><span className="arc"></span>
              <span style={{ color: "var(--accent-warm)" }}>Abidjan</span>
            </div>
            <h1>Votre bien au pays,<br /><span className="s">sous vos yeux.</span></h1>
            <p className="sub">
              Dès que votre locataire paie, vous recevez la notification.{" "}
              <b>Voyez, encaissez et prouvez chaque loyer</b> — en temps réel, où que vous soyez. La transparence absolue.
            </p>
            <div className="cta-row">
              <button className="btn btn-primary" onClick={handleLoyerClick}>🔑 Gérer mon loyer</button>
              <button className="btn btn-ghost" onClick={goAuth}>Se connecter</button>
            </div>
            <div className="microtrust">
              <span><i className="g"></i> Disponible maintenant</span>
              <span><i className="g"></i> Paiement Wave &amp; CinetPay</span>
              <span><i className="g"></i> Sans commission cachée</span>
            </div>
          </div>

          <div className="heroviz">
            <div className="device" role="img" aria-label="Tableau de bord Diomandé — loyers collectés et statut des locataires">
              <div className="notch"></div>
              <div className="scr">
                <div className="sbar"><span>9:41</span><div className="r"><span>5G</span><div className="batt"><i></i></div></div></div>
                <div className="abar"><div><div className="hi">Bonjour,</div><div className="who">Kouamé</div></div><div className="chip">Les Palmiers ▾</div></div>
                <div className="pb">
                  <div className="heroc">
                    <div className="l">Collecté ce mois</div>
                    <div className="a">910 000 <small>FCFA</small></div>
                    <div className="x">sur 1 255 000 attendus</div>
                    <div className="pbar"><i style={{ width: "73%" }}></i></div>
                    <div className="hf"><span className="g">73 % collectés</span><span className="m">+2 aujourd'hui</span></div>
                  </div>
                  <div className="stat2">
                    <div className="st"><div className="sl">Occupation</div><div className="sv">5/6</div></div>
                    <div className="st warn"><div className="sl">En retard</div><div className="sv">1 lot</div></div>
                  </div>
                </div>
                <div className="lst pb">
                  <div className="lrow"><div className="av">AK</div><div><div className="nm">Aïcha Koné</div><div className="mt">2 Pièces · Cocody</div></div><div className="pill paid">Payé ✓</div></div>
                  <div className="lrow"><div className="av">KY</div><div><div className="nm">Koffi Yao</div><div className="mt">Studio · Marcory</div></div><div className="pill paid">Payé ✓</div></div>
                  <div className="lrow"><div className="av">MT</div><div><div className="nm">Mariam Traoré</div><div className="mt">Villa · Marcory</div></div><div className="pill late">En retard</div></div>
                </div>
              </div>
            </div>
            <div className="toast"><div className="tk">✓</div><div><div className="tt">Loyer reçu — 40 000 FCFA</div><div className="ts">Mariam Traoré · via Wave</div></div></div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT */}
      <section className="engage">
        <div className="wrap">
          <div className="eyebrow" style={{ display: "block", textAlign: "center" }}>Notre engagement</div>
          <p className="engage-line">La <span className="s">transparence absolue.</span> Sur chaque loyer, chaque franc, chaque bien.</p>
        </div>
      </section>

      {/* BENEFIT */}
      <section>
        <div className="wrap">
          <div className="sec-h">
            <div className="eyebrow">Ce qui change pour vous</div>
            <h2 style={{ marginTop: 14 }}>Gérer son bien au pays,<br />sans y penser.</h2>
            <p className="lede">Diomandé enlève la charge mentale. Vous ne courez plus après l'information — elle vient à vous.</p>
          </div>
          <div className="pillars">
            <div className="pil"><div className="ic">🔔</div><h3>Ne plus jamais demander</h3><p>Vous ouvrez l'app, vous savez. Fini les appels pour vérifier si le loyer est bien tombé.</p></div>
            <div className="pil"><div className="ic">✅</div><h3>Être payé, sans courir</h3><p>Le locataire paie en un geste, vous encaissez directement — et vous êtes notifié à l'instant.</p></div>
            <div className="pil"><div className="ic">🌙</div><h3>Dormir tranquille</h3><p>Tout est tracé, prouvé, à sa place. Votre bien est veillé, même quand vous ne regardez pas.</p></div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="founder">
        <div className="wrap grid">
          <div><div className="k">Le mot du fondateur</div><h2 style={{ marginTop: 12 }}>Pourquoi j'ai créé Diomandé</h2></div>
          <div className="story">
            <p>Mon père a travaillé plus de vingt ans aux États-Unis. Chaque mois, il envoyait de l'argent au pays pour bâtir un immeuble — pierre après pierre, sans jamais le voir fini.</p>
            <p>Quand il nous a quittés, pendant la COVID, nous étions loin. Et nous avons compris que nous n'avions jamais rien vu : ni les comptes, ni les loyers, ni ce que devenait le travail de toute sa vie. Juste une phrase, répétée : « ne t'inquiète pas, tout va bien là-bas ».</p>
            <p>J'ai créé Diomandé pour qu'aucune famille n'ait plus jamais à croire sur parole ce qu'un des siens a bâti de ses mains.<span className="sig">— DIOM, fondateur</span></p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment">
        <div className="wrap">
          <div className="sec-h">
            <div className="eyebrow">Comment ça marche</div>
            <h2 style={{ marginTop: 14 }}>Trois gestes. Zéro doute.</h2>
            <p className="lede">Un système pensé pour trois rôles — propriétaire, gérant, locataire — reliés par un code unique par logement.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="num">1</div><h3>Créez vos biens</h3><p>Ajoutez vos propriétés et vos lots. Chaque logement reçoit un code d'invitation unique.</p></div>
            <div className="step"><div className="num">2</div><h3>Le locataire paie</h3><p>Il rejoint avec son code et règle son loyer par Wave ou CinetPay. En un geste, sans intermédiaire.</p></div>
            <div className="step"><div className="num">3</div><h3>Vous voyez tout</h3><p>Notification à chaque paiement. Reçu automatique des deux côtés. Payé, en retard, collecté — en temps réel.</p></div>
          </div>
          <div className="roles">
            <span className="role"><b>Propriétaire</b> · voit tout</span>
            <span className="role"><b>Gérant</b> · encaisse &amp; suit</span>
            <span className="role"><b>Locataire</b> · paie &amp; garde ses reçus</span>
          </div>
        </div>
      </section>

      {/* PREUVE */}
      <section id="preuve" style={{ background: "var(--ground2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-h"><div className="eyebrow">La preuve, pas la promesse</div><h2 style={{ marginTop: 14 }}>La transparence, montrée — pas jurée.</h2></div>
          <div className="pillars">
            <div className="pil"><div className="ic">👁️</div><h3>Voir</h3><p>Attendu contre collecté, occupation, qui a payé et qui est en retard. Tout votre parc sur un écran.</p><div className="mini"><b>Temps réel</b> · où que vous soyez</div></div>
            <div className="pil"><div className="ic">💳</div><h3>Encaisser</h3><p>Le loyer arrive directement, par mobile money. Vous êtes notifié à chaque paiement.</p><div className="mini"><b>Wave &amp; CinetPay</b> · sans intermédiaire</div></div>
            <div className="pil"><div className="ic">📄</div><h3>Prouver</h3><p>Un reçu instantané et un historique complet. Chaque franc tracé — pour vous, pour votre locataire.</p><div className="mini"><b>Reçus &amp; historique</b> · zéro doute</div></div>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section>
        <div className="wrap">
          <div className="sec-h"><div className="eyebrow">Pourquoi Diomandé</div><h2 style={{ marginTop: 14 }}>Ce que vous utilisez aujourd'hui — et ce qui change.</h2></div>
          <div className="cmp-wrap">
            <table className="cmp">
              <thead><tr><th></th><th>Le proche</th><th>L'huissier</th><th>Le silence</th><th className="us">Diomande.</th></tr></thead>
              <tbody>
                <tr><td>Coût</td><td>« Gratuit »</td><td>Frais + commission</td><td>Le bien se vide</td><td className="us">Forfait clair</td></tr>
                <tr><td>Vue en temps réel</td><td className="no">✕</td><td className="no">✕</td><td className="no">✕</td><td className="us"><span className="yes">✓</span></td></tr>
                <tr><td>Reçu &amp; historique</td><td className="no">✕</td><td>Papier, en retard</td><td className="no">✕</td><td className="us"><span className="yes">✓ instantané</span></td></tr>
                <tr><td>Notifié à chaque paiement</td><td className="no">✕</td><td className="no">✕</td><td className="no">✕</td><td className="us"><span className="yes">✓</span></td></tr>
                <tr><td>Fait pour le propriétaire à distance</td><td className="no">✕</td><td className="no">✕</td><td className="no">✕</td><td className="us"><span className="yes">✓</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS (real) */}
      <section id="pourqui" style={{ background: "var(--ground2)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-h"><div className="eyebrow">Ce que disent nos clients</div><h2 style={{ marginTop: 14 }}>Ils gèrent déjà, en toute transparence.</h2></div>
          <div className="avs">
            <div className="avc"><div className="hd"><div className="face">KM</div><div><div className="nm2">Kouassi Marie</div><div className="lo">Propriétaire</div></div></div>
              <div className="qt">« Grâce à l'application Diom225, je reçois mes loyers à temps chaque fin du mois ! »</div></div>
            <div className="avc"><div className="hd"><div className="face">DI</div><div><div className="nm2">Diabaté Ibrahim</div><div className="lo">Acheteur</div></div></div>
              <div className="qt">« J'ai trouvé mon terrain idéal avec un titre foncier vérifié. Transaction transparente. »</div></div>
            <div className="avc"><div className="hd"><div className="face">TF</div><div><div className="nm2">Traoré Fatou</div><div className="lo">Locataire</div></div></div>
              <div className="qt">« Payer mon loyer en ligne, c'est tellement pratique. Plus besoin de me déplacer ! »</div></div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="tarifs">
        <div className="wrap">
          <div className="sec-h"><div className="eyebrow">Tarifs</div><h2 style={{ marginTop: 14 }}>Un prix clair. Bien moins qu'un huissier.</h2>
            <p className="lede">Vous ne payez que quand vous encaissez. Pas d'abonnement piège, pas de commission cachée.</p></div>
          <div className="price">
            <div className="pcard hero-price">
              <div className="pt">Gestion Diomandé</div>
              <div className="amt">10 %<small> du loyer encaissé</small></div>
              <div className="pd">Prélevé seulement sur les loyers réellement collectés. C'est tout.</div>
              <ul className="plist">
                <li>Tableau de bord propriétaire &amp; gérant</li>
                <li>Encaissement Wave &amp; CinetPay</li>
                <li>Notifications &amp; reçus automatiques</li>
                <li>Suivi payé / en retard / collecté</li>
                <li>Support d'agents sur le terrain</li>
              </ul>
            </div>
            <div className="pcard alt">
              <div className="pt">Ce que ça remplace</div>
              <div className="amt" style={{ fontSize: 34, color: "var(--ink2)" }}>L'informel</div>
              <div className="pd">Le vrai coût d'aujourd'hui n'est pas sur une facture — il est dans ce que vous ne voyez pas.</div>
              <ul className="plist">
                <li>Le cousin : gratuit, mais aucune trace</li>
                <li>L'huissier : cher, et du papier en retard</li>
                <li>Le silence : des loyers jamais versés</li>
                <li>Des mois de revenus, appris trop tard</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "var(--ground2)", borderTop: "1px solid var(--line)" }}>
        <div className="wrap">
          <div className="sec-h"><div className="eyebrow">Questions</div><h2 style={{ marginTop: 14 }}>Ce qu'on nous demande</h2></div>
          <div className="faq">
            <div className="qa"><h4>Ça marche avec Wave ?</h4><p>Oui — l'encaissement se fait par Wave et CinetPay, les moyens que vos locataires utilisent déjà au quotidien.</p></div>
            <div className="qa"><h4>Ma famille va-t-elle se sentir remplacée ?</h4><p>Non. Diomandé soulage le proche qui « gère » — il donne à tout le monde les mêmes chiffres, sans accuser personne.</p></div>
            <div className="qa"><h4>Mes locataires vont-ils vraiment l'utiliser ?</h4><p>Ils rejoignent avec un simple code et paient comme ils envoient déjà de l'argent. Et ils gardent leurs reçus.</p></div>
            <div className="qa"><h4>Où va mon argent ?</h4><p>Le loyer arrive directement, tracé de bout en bout. Vous êtes notifié à chaque paiement, avec reçu à l'appui.</p></div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final" id="commencer">
        <div className="final-bg"></div>
        <div className="wrap">
          <div className="eyebrow center" style={{ display: "block" }}>Disponible maintenant</div>
          <h2 style={{ marginTop: 16 }}>L'immobilier ivoirien,<br />en <span className="s">transparence absolue.</span></h2>
          <div className="cta-row">
            <button className="btn btn-primary" onClick={handleLoyerClick}>Gérer mon loyer</button>
            <button className="btn btn-ghost" onClick={goAuth}>Connexion / Inscription</button>
          </div>
          <div className="microtrust center" style={{ marginTop: 20, justifyContent: "center" }}>
            <span><i className="g"></i> Transparence absolue</span>
            <span><i className="g"></i> Titres vérifiés · paiement sécurisé</span>
          </div>
        </div>
      </section>

      {/* FOOTER — kept from live site (real links, newsletter, contact) */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-col">
            <h3 className="logo">Diomande<span>.com</span></h3>
            <p>Plateforme immobilière de confiance en Côte d'Ivoire</p>
            <p className="secure"><FaShieldAlt /> Paiements sécurisés</p>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><a href="/loye">Gérer mes biens (Loyer)</a></li>
              <li><a href="/land">Acheter un terrain</a></li>
              <li><a href="/home">Acheter une maison</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <ul>
              <li><a href="/contact">Nous contacter</a></li>
              <li><a href="/privacy">Confidentialité</a></li>
              <li><a href="/terms">Conditions d'utilisation</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Recevez les dernières offres immobilières</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Votre email" aria-label="Votre email" />
              <button type="submit" className="btn btn-primary">S'inscrire</button>
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
