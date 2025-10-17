// client/src/pages/loye/ReceiptPage.jsx
import React, { useEffect, useState } from "react";
import { Download, Home, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReceiptField } from "@/components/ReceiptField";
import diomandeLogo from "@/assets/diomande-logo.png";
import api from "@/utils/axiosInstance";

export default function ReceiptPage() {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch latest payment
  useEffect(() => {
    async function fetchLatestPayment() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        const res = await api.get("/api/loye/payments/renter/payments/latest");
        setPayment(res.data);
      } catch (err) {
        console.error("Erreur de récupération du reçu :", err);
        setError("Aucun reçu trouvé");
      } finally {
        setLoading(false);
      }
    }

    fetchLatestPayment();
  }, []);

  const handleDownloadPDF = () => {
    window.print(); // simple version — print/download PDF
  };

  const handleReturnToDashboard = () => {
    window.location.href = "/loye/dashboard";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Chargement du reçu...
      </div>
    );

  if (error || !payment)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h3 className="text-lg font-semibold mb-4">Aucun reçu trouvé</h3>
        <Button onClick={handleReturnToDashboard}>Retour au tableau de bord</Button>
      </div>
    );

  // ✅ Prepare clean fields
  const property = payment.property || {};
  const renter = payment.renter || {};
  const owner = payment.owner || {};

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Receipt Card */}
        <Card className="relative overflow-hidden shadow-xl border-border">
          {/* Watermark */}
          <div className="absolute bottom-6 right-6 opacity-5 pointer-events-none">
            <img src={diomandeLogo} alt="Diomande watermark" className="w-32 h-32" />
          </div>

          <div className="p-8 sm:p-10 space-y-8 relative">
            {/* Header */}
            <div className="text-center space-y-2 pb-2">
              <h1 className="text-3xl font-bold text-foreground">Reçu de Paiement</h1>
              <div className="flex justify-center items-center gap-2">
                <Badge className="bg-green-600 text-white gap-1.5 px-3 py-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Payé
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Receipt Info */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase mb-1.5">
                  Numéro de reçu
                </p>
                <p className="text-sm font-semibold">
                  {payment._id || "—"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground uppercase mb-1.5">
                  Date du paiement
                </p>
                <p className="text-sm font-semibold">
                  {new Date(payment.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Amount Highlight */}
            <div className="text-center py-4 space-y-2">
              <p className="text-sm text-muted-foreground uppercase tracking-wide">
                Montant payé
              </p>
              <p className="text-5xl font-bold text-orange-500">
                {(payment.netAmount || payment.amount)?.toLocaleString("fr-FR")} FCFA
              </p>
              <p className="text-sm text-muted-foreground">
                {payment.period?.month
                  ? `${payment.period.month}/${payment.period.year}`
                  : ""}
              </p>
            </div>

            <Separator />

            {/* All Details */}
            <div className="space-y-6">
              {/* Property */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  📍 Informations du logement
                </h3>
                <div className="space-y-2.5 pl-1">
                  <ReceiptField label="Propriété" value={property.name || "—"} />
                  <ReceiptField label="Adresse" value={property.address || "—"} />
                  <ReceiptField label="Code" value={payment.unitCode || "—"} />
                </div>
              </div>

              <Separator />

              {/* Renter */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  👤 Locataire
                </h3>
                <div className="space-y-2.5 pl-1">
                  <ReceiptField label="Nom" value={renter.name || "—"} />
                  <ReceiptField label="Téléphone" value={renter.phone || "—"} />
                </div>
              </div>

              <Separator />

              {/* Owner / Manager */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  🏠 Propriétaire / Gestionnaire
                </h3>
                <div className="space-y-2.5 pl-1">
                  <ReceiptField label="Nom" value={owner.name || "—"} />
                  <ReceiptField label="Téléphone" value={owner.phone || "—"} />
                </div>
              </div>

              <Separator />

              {/* Payment Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  💳 Détails de transaction
                </h3>
                <div className="space-y-2.5 pl-1">
                  <ReceiptField label="Méthode de paiement" value={payment.provider || "—"} />
                  <ReceiptField label="ID transaction" value={payment.transactionId || "—"} />
                </div>
              </div>
            </div>

            <Separator />

            {/* Footer */}
            <p className="text-center text-sm text-muted-foreground italic pt-2">
              Merci pour votre paiement et votre confiance 💙
            </p>
          </div>
        </Card>

        {/* Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleDownloadPDF}
            className="w-full bg-card hover:bg-accent border-2 transition-all hover:shadow-md"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger le PDF
          </Button>
          <Button
            size="lg"
            onClick={handleReturnToDashboard}
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </main>
  );
}
