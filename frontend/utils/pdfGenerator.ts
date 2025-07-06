export const generateReportPDF = (rapport: any) => {
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
                background: ${rapport.notePerformance >= 90 ? "#dcfce7" : rapport.notePerformance >= 80 ? "#dbeafe" : "#fef3c7"};
                border-radius: 12px;
                margin: 20px 0;
            }
            .score {
                font-size: 48px;
                font-weight: bold;
                color: ${rapport.notePerformance >= 90 ? "#16a34a" : rapport.notePerformance >= 80 ? "#2563eb" : "#d97706"};
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
                background: ${rapport.statut === "VALIDE" ? "#dcfce7" : rapport.statut === "EN_COURS" ? "#dbeafe" : "#fef3c7"};
                color: ${rapport.statut === "VALIDE" ? "#16a34a" : rapport.statut === "EN_COURS" ? "#2563eb" : "#d97706"};
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">📡 SenTel</div>
            <div class="report-title">Rapport de Dimensionnement 5G</div>
            <div>Rapport #${rapport.id} - ${rapport.projet}</div>
        </div>

        <div class="report-info">
            <div class="info-section">
                <div class="info-label">Date de génération</div>
                <div class="info-value">${rapport.date}</div>
            </div>
            <div class="info-section">
                <div class="info-label">Configuration ID</div>
                <div class="info-value">#${rapport.configurationId}</div>
            </div>
            <div class="info-section">
                <div class="info-label">Statut</div>
                <div class="info-value">
                    <span class="status-badge">
                        ${rapport.statut === "VALIDE" ? "Validé" : rapport.statut === "EN_COURS" ? "En cours" : "En attente"}
                    </span>
                </div>
            </div>
        </div>

        <div class="performance-section">
            <h2>Performance Globale</h2>
            <div class="performance-score">
                <div class="score">${rapport.notePerformance}</div>
                <div class="score-label">Score de Performance (/100)</div>
            </div>
        </div>

        <div class="details-grid">
            <div class="detail-card">
                <div class="detail-title">Puissance Reçue</div>
                <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">
                    ${rapport.puissanceRecue} dBm
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    ${rapport.puissanceRecue > -80 ? "Excellent signal" : rapport.puissanceRecue > -90 ? "Bon signal" : "Signal faible"}
                </div>
            </div>
            
            <div class="detail-card">
                <div class="detail-title">Qualité du Lien</div>
                <div style="font-size: 24px; font-weight: bold; color: #10b981;">
                    ${rapport.notePerformance >= 90 ? "Excellent" : rapport.notePerformance >= 80 ? "Bon" : "Moyen"}
                </div>
                <div style="font-size: 12px; color: #64748b; margin-top: 5px;">
                    Basé sur les métriques de performance
                </div>
            </div>
        </div>

        <div class="conclusion-section">
            <h3 style="margin-top: 0;">Conclusion et Recommandations</h3>
            <p>${rapport.conclusion}</p>
            
            ${
              rapport.notePerformance < 80
                ? `
            <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin-top: 15px;">
                <strong style="color: #dc2626;">⚠️ Points d'attention :</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Performance inférieure aux standards recommandés</li>
                    <li>Révision de la configuration suggérée</li>
                    <li>Vérification des paramètres d'antenne recommandée</li>
                </ul>
            </div>
            `
                : `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 15px; margin-top: 15px;">
                <strong style="color: #16a34a;">✅ Configuration optimale :</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Performance conforme aux standards</li>
                    <li>Déploiement recommandé</li>
                    <li>Monitoring continu suggéré</li>
                </ul>
            </div>
            `
            }
        </div>

        <div class="footer">
            <p>Rapport généré automatiquement par SenTel - Plateforme de dimensionnement 5G</p>
            <p>© 2024 SenTel. Tous droits réservés.</p>
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
        // Optionnel: fermer la fenêtre après impression
        // printWindow.close()
      }, 500)
    }
  }
}
