export const generateReportPDF = (rapport) => {
  // Formater les données pour l'affichage
  const formattedDate = new Date(rapport.date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const debitFormatted = (rapport.debitEstime / 1000000).toFixed(2)
  const puissanceFormatted = rapport.puissanceRecu?.toFixed(2)
  const noteFormatted = rapport.notePerformance?.toFixed(2)
  const latenceFormatted = rapport.latenceEstimee?.toFixed(2)

  // Créer le contenu HTML du rapport
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Rapport SenTel #${rapport.id}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
                color: #333;
                line-height: 1.6;
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #3b82f6;
                padding-bottom: 20px;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #3b82f6;
                margin-bottom: 10px;
            }
            .report-title {
                font-size: 20px;
                margin: 10px 0;
            }
            .report-info {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                background: #f8fafc;
                padding: 15px;
                border-radius: 8px;
            }
            .info-section {
                flex: 1;
            }
            .info-label {
                font-weight: bold;
                color: #64748b;
                font-size: 12px;
                text-transform: uppercase;
            }
            .info-value {
                font-size: 16px;
                margin-top: 5px;
            }
            .performance-section {
                margin: 30px 0;
            }
            .performance-score {
                text-align: center;
                padding: 20px;
                background: ${rapport.notePerformance >= 0 ? "#dcfce7" : rapport.notePerformance >= -50 ? "#dbeafe" : "#fef3c7"};
                border-radius: 12px;
                margin: 20px 0;
            }
            .score {
                font-size: 48px;
                font-weight: bold;
                color: ${rapport.notePerformance >= 0 ? "#16a34a" : rapport.notePerformance >= -50 ? "#2563eb" : "#d97706"};
            }
            .score-label {
                font-size: 14px;
                color: #64748b;
                margin-top: 10px;
            }
            .details-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin: 30px 0;
            }
            .detail-card {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
            }
            .detail-title {
                font-weight: bold;
                color: #1e293b;
                margin-bottom: 10px;
            }
            .conclusion-section {
                background: #f1f5f9;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
            }
            .footer {
                text-align: center;
                margin-top: 50px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
                color: #64748b;
                font-size: 12px;
            }
            .status-badge {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: bold;
                background: ${rapport.status === "VALIDE" ? "#dcfce7" : rapport.status === "INSUFFISANT" ? "#fee2e2" : "#fef3c7"};
                color: ${rapport.status === "VALIDE" ? "#16a34a" : rapport.status === "INSUFFISANT" ? "#dc2626" : "#d97706"};
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📡 SenTel</div>
            <div class="report-title">Rapport de Dimensionnement 5G</div>
            <div>Rapport #${rapport.id}</div>
        </div>

        <div class="report-info">
            <div class="info-section">
                <div class="info-label">Date de génération</div>
                <div class="info-value">${formattedDate}</div>
            </div>
            <div class="info-section">
                <div class="info-label">Statut</div>
                <div class="info-value">
                    <span class="status-badge">
                        ${rapport.status === "VALIDE" ? "Validé" : rapport.status === "INSUFFISANT" ? "Insuffisant" : rapport.status || "Non spécifié"}
                    </span>
                </div>
            </div>
        </div>

        <div class="performance-section">
            <h2>Performance Globale</h2>
            <div class="performance-score">
                <div class="score">${noteFormatted}</div>
                <div class="score-label">Score de Performance</div>
            </div>
        </div>

        <div class="details-grid">
            <div class="detail-card">
                <div class="detail-title">Puissance Reçue</div>
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">
                    ${puissanceFormatted} dBm
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    ${rapport.puissanceRecu > -80 ? "Excellent signal" : rapport.puissanceRecu > -90 ? "Bon signal" : "Signal faible"}
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-title">Débit Estimé</div>
                <div style="font-size: 24px; font-weight: bold; color: #10b981;">
                    ${debitFormatted} Mbps
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    Débit théorique estimé
                </div>
            </div>

            <div class="detail-card">
                <div class="detail-title">Marge de Liaison</div>
                <div style="font-size: 24px; font-weight: bold; color: #8b5cf6;">
                    ${rapport.margeLiaison?.toFixed(2)} dB
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    Marge entre le signal reçu et le seuil
                </div>
            </div>

            <div class="detail-card">
                <div class="detail-title">Latence Estimée</div>
                <div style="font-size: 24px; font-weight: bold; color: #ec4899;">
                    ${latenceFormatted} ms
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    Temps de réponse estimé
                </div>
            </div>
        </div>

        <div class="conclusion-section">
            <h3 style="margin-top: 0;">Conclusion et Recommandations</h3>
            <p>${rapport.conclusion || "Aucune conclusion fournie"}</p>
            
            ${
              rapport.status === "INSUFFISANT"
                ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin-top: 15px;">
                <strong style="color: #dc2626;">⚠️ Points d'attention :</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Performance inférieure aux standards recommandés</li>
                    <li>${rapport.conclusion || "La liaison ne répond pas aux exigences minimales pour la 5G"}</li>
                    <li>Vérification des paramètres d'antenne recommandée</li>
                </ul>
            </div>
            `
                : `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin-top: 15px;">
                <strong style="color: #16a34a;">✅ Configuration optimale :</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Performance conforme aux standards</li>
                    <li>${rapport.conclusion || "La liaison répond aux exigences pour la 5G"}</li>
                    <li>Monitoring continu suggéré</li>
                </ul>
            </div>
            `
            }
        </div>

        <div class="footer">
            <p>Rapport généré automatiquement par SenTel - Plateforme de dimensionnement 5G</p>
            <p>© ${new Date().getFullYear()} SenTel. Tous droits réservés.</p>
        </div>
    </body>
    </html>
  `

  // Créer une nouvelle fenêtre pour l'impression
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Attendre que le contenu soit chargé puis déclencher l'impression
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }
}