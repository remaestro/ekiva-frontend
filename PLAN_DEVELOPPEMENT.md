# 📋 Plan de Développement EKIVA Insurance Platform

Ce document détaille la feuille de route pour le développement de la plateforme EKIVA avec **Angular 17+**, **TailwindCSS**, **.NET 8** et **SQL Server**.

## 🎯 PHASE 0: Préparation de l'Environnement (1-2 jours)

### Backend (.NET 8)
1. **Créer la solution .NET 8**
   - API Web ASP.NET Core
   - Projets: `Ekiva.API`, `Ekiva.Core`, `Ekiva.Infrastructure`, `Ekiva.Application`
   
2. **Packages NuGet essentiels**
   ```
   - Microsoft.EntityFrameworkCore.SqlServer
   - Microsoft.AspNetCore.Identity.EntityFrameworkCore
   - Microsoft.AspNetCore.Authentication.JwtBearer
   - AutoMapper.Extensions.Microsoft.DependencyInjection
   - FluentValidation.AspNetCore
   - Swashbuckle.AspNetCore (Swagger)
   - Serilog.AspNetCore
   ```

### Frontend (Angular 17+)
1. **Créer le projet Angular 17+**
   ```bash
   ng new ekiva-insurance --standalone=false --routing --style=css
   ```

2. **Installer TailwindCSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

3. **Packages npm essentiels**
   ```
   - @ngrx/store, @ngrx/effects (gestion d'état)
   - @angular/material (composants UI)
   - chart.js, ng2-charts (graphiques)
   - ngx-mask (masques de saisie)
   - date-fns (manipulation dates)
   - jspdf, jspdf-autotable (génération PDF)
   ```

### Base de données SQL Server
1. **Créer la base de données**
2. **Configurer Entity Framework Core**
3. **Migrations initiales**

---

## 🏗️ PHASE 1: Architecture & Infrastructure (3-5 jours)

Voir [ARCHITECTURE_BACKEND.md](./ARCHITECTURE_BACKEND.md) et [ARCHITECTURE_FRONTEND.md](./ARCHITECTURE_FRONTEND.md) pour les détails.

---

## 📊 PHASE 2: Module Base de Données & Référentiels (5-7 jours)

### Backend
**2.1 Créer toutes les entités**
- ✅ Profiles, UserRoles, UserGroups
- ✅ Clients, Distributors
- ✅ Subsidiaries, Branches, Currencies
- ✅ VehicleCategories, VehicleMakes, VehicleModels
- ✅ ProfessionalCategories
- ✅ CommissionRates, ProductTaxRates

**2.2 Repositories & Unit of Work**
**2.3 API Endpoints Référentiels**

### Frontend
**2.4 Services Angular**
- `ReferenceDataService` pour charger les listes déroulantes.

---

## 🚗 PHASE 3: Module Motor Insurance (10-15 jours)

### Backend
**3.1 Entités Motor**
- MotorProducts, MotorCoverages, MotorProductCoverages
- CoverageSections (A-H)
- RatingFactors, ShortTermFactors, PolicyCosts
- Quotes, QuoteSections, Policies

**3.2 Service de Calcul de Prime**
Voir [REGLES_METIER.md](./REGLES_METIER.md) pour les algorithmes.

**3.3 API Endpoints Motor**

### Frontend
**3.4 Module Motor**
- Wizard de création de devis (4 étapes)
- Calculateur de prime en temps réel

---

## 🏢 PHASE 4: Module Liability Insurance (8-10 jours)

### Backend
**4.1 Entités Liability**
- LiabilityActivities, LiabilityTariffRates
- LiabilityQuotes, LiabilityPolicies

**4.2 Service de Calcul RC**
Voir [REGLES_METIER.md](./REGLES_METIER.md).

### Frontend
**4.4 Module Liability**
- Formulaire RC Artisans et Commerce
- Gestion des biens confiés

---

## 🏥 PHASE 5: Module Health Insurance (Optionnel - 8-10 jours)

- Structure similaire à Motor et Liability
- Gestion des membres/bénéficiaires
- Plans de santé

---

## 🔐 PHASE 6: Module Authentification & Autorisation (3-5 jours)

### Backend
**6.1 Identity & JWT**
- Login, Register, Refresh Token
- Gestion des rôles (Admin, Broker, User)

### Frontend
**6.3 Module Auth**
- Guards, Interceptors
- Gestion de session

---

## 👥 PHASE 7: Module Clients & Distributeurs (5-7 jours)

### Backend
- CRUD Clients (Individual/Company)
- CRUD Distributors
- Gestion des agents assignés

### Frontend
- Liste clients avec recherche/filtres
- Formulaire client
- Gestion distributeurs

---

## 💰 PHASE 8: Module Commission & Taxes (3-5 jours)

### Backend
**8.1 Services de Commission**
- Calcul des commissions par produit/distributeur
- Calcul des taxes (CIMA)

---

## 📄 PHASE 9: Module ASACI Integration (5-7 jours)

### Backend
**9.1 Service ASACI**
- Création et vérification des attestations
- Gestion des statuts (suspend/cancel)

### Frontend
- Génération attestations depuis devis
- Suivi statut

---

## 📊 PHASE 10: Module Admin & Reporting (7-10 jours)

### Backend
**10.1 Admin APIs**
- Configuration produits
- Rapports & statistiques

### Frontend
**10.2 Module Admin**
- Dashboard avec KPIs
- Gestion des utilisateurs et paramètres

---

## 📱 PHASE 11: UI/UX & Responsive Design (5-7 jours)

- Design System avec TailwindCSS
- Composants partagés (DataTable, Forms)
- Responsive Mobile-First

---

## 🧪 PHASE 12: Tests (5-7 jours)

- Tests Unitaires Backend (xUnit)
- Tests d'Intégration
- Tests Frontend (Jasmine/Karma)

---

## 📦 PHASE 13: Génération de Documents (3-5 jours)

- Service PDF (Backend ou Frontend avec jsPDF)
- Devis, Polices, Attestations

---

## 🚀 PHASE 14: Déploiement & DevOps (3-5 jours)

- CI/CD Pipeline (GitHub Actions)
- Hébergement (Azure/AWS)
- Monitoring

---

## ⏱️ ESTIMATION TOTALE

| Phase | Durée | Priorité |
|-------|-------|----------|
| Phase 0: Environnement | 1-2 jours | ⭐⭐⭐⭐⭐ |
| Phase 1: Architecture | 3-5 jours | ⭐⭐⭐⭐⭐ |
| Phase 2: Référentiels | 5-7 jours | ⭐⭐⭐⭐⭐ |
| Phase 3: Motor Insurance | 10-15 jours | ⭐⭐⭐⭐⭐ |
| Phase 4: Liability Insurance | 8-10 jours | ⭐⭐⭐⭐ |
| Phase 5: Health Insurance | 8-10 jours | ⭐⭐⭐ |
| Phase 6: Auth & Security | 3-5 jours | ⭐⭐⭐⭐⭐ |
| Phase 7: Clients & Distributeurs | 5-7 jours | ⭐⭐⭐⭐ |
| Phase 8: Commission & Taxes | 3-5 jours | ⭐⭐⭐⭐ |
| Phase 9: ASACI Integration | 5-7 jours | ⭐⭐⭐⭐ |
| Phase 10: Admin & Reporting | 7-10 jours | ⭐⭐⭐ |
| Phase 11: UI/UX | 5-7 jours | ⭐⭐⭐⭐ |
| Phase 12: Tests | 5-7 jours | ⭐⭐⭐⭐ |
| Phase 13: Documents PDF | 3-5 jours | ⭐⭐⭐ |
| Phase 14: Déploiement | 3-5 jours | ⭐⭐⭐⭐ |
| Phase 15: Documentation | 3-5 jours | ⭐⭐⭐ |

**TOTAL: 80-115 jours (3-5 mois) pour 1 développeur full-stack**
