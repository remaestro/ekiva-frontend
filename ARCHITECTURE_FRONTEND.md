# 🏗️ Architecture Frontend (Angular 17+)

## 1. Architecture Globale

Le frontend est une Single Page Application (SPA) construite avec **Angular 17+** et stylisée avec **TailwindCSS**. L'architecture est modulaire et orientée "Features".

### Structure du Projet

```
src/app/
├── core/                 # Singletons, Services globaux, Interceptors
│   ├── auth/             # Authentification (Service, Guard, Interceptor)
│   ├── services/         # Services API globaux (ex: ApiService)
│   ├── models/           # Interfaces TypeScript globales
│   └── utils/            # Fonctions utilitaires
├── features/             # Modules fonctionnels (Lazy Loaded)
│   ├── auth/             # Login, Register, Forgot Password
│   ├── dashboard/        # Vue d'ensemble
│   ├── motor/            # Gestion Auto (Devis, Polices)
│   ├── liability/        # Gestion RC (Devis, Polices)
│   ├── clients/          # Gestion Clients
│   └── admin/            # Administration
├── shared/               # Composants, Pipes, Directives réutilisables
│   ├── components/       # UI Kit (Boutons, Inputs, Modals)
│   ├── pipes/            # Formatage (Devise, Date)
│   └── directives/       # Comportements (Permissions)
└── layout/               # Structure de la page
    ├── header/
    ├── sidebar/
    └── footer/
```

## 2. Technologies Clés

- **Framework**: Angular 17+ (Standalone Components)
- **Styling**: TailwindCSS (Utility-first CSS)
- **UI Components**: Angular Material (pour les composants complexes comme Datepicker, Dialog) + Composants Custom Tailwind
- **State Management**: NgRx (Store, Effects, Selectors) ou Services avec RxJS `BehaviorSubject` (selon complexité)
- **Formulaires**: Reactive Forms
- **HTTP Client**: Angular HttpClient
- **Graphiques**: Chart.js / ng2-charts

## 3. Détail des Modules

### 3.1 Core Module
Contient tout ce qui doit être instancié une seule fois au démarrage.
- `AuthService`: Gestion de la connexion et du token JWT.
- `AuthGuard`: Protection des routes.
- `JwtInterceptor`: Injection du token dans les headers HTTP.
- `ErrorInterceptor`: Gestion globale des erreurs HTTP.

### 3.2 Shared Module
Contient les éléments réutilisables importés dans les Features.
- `DataTableComponent`: Tableau générique avec tri, filtre et pagination.
- `ConfirmDialogComponent`: Modal de confirmation.
- `CurrencyPipe`: Formatage FCFA.

### 3.3 Feature Modules (Lazy Loaded)

#### Motor Module (`features/motor`)
- **Pages**:
  - `QuoteListComponent`: Liste des devis auto.
  - `QuoteCreateComponent`: Wizard de création (Stepper).
  - `QuoteDetailComponent`: Vue détaillée et actions (Convertir, Imprimer).
- **Composants**:
  - `VehicleFormComponent`: Formulaire véhicule.
  - `CoverageSelectorComponent`: Sélection des garanties.
  - `PremiumSummaryComponent`: Affichage du calcul en temps réel.

#### Liability Module (`features/liability`)
- Similaire au module Motor, adapté pour la RC Artisans & Commerce.
- Gestion spécifique des "Biens Confiés".

## 4. Configuration TailwindCSS

Le fichier `tailwind.config.js` sera configuré avec le thème EKIVA :

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF', // Bleu EKIVA
          light: '#3B82F6',
          dark: '#1E3A8A',
        },
        secondary: '#10B981', // Vert validation
        accent: '#F59E0B',    // Orange action
        danger: '#EF4444',    // Rouge erreur
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
}
```

## 5. Gestion de l'État (State Management)

Pour les formulaires complexes comme le Wizard de création de devis, nous utiliserons un service avec `BehaviorSubject` ou NgRx pour conserver l'état entre les étapes.

**Exemple : `MotorQuoteStateService`**
- Conserve les données de l'étape 1 (Assuré) pendant que l'utilisateur est à l'étape 2 (Véhicule).
- Permet de revenir en arrière sans perdre les données.
- Recalcule la prime automatiquement à chaque changement significatif.

## 6. Intégration API

Les services Angular (`MotorQuoteService`, `ClientService`) communiquent avec l'API Backend via `HttpClient`.
Toutes les réponses sont typées avec des interfaces TypeScript correspondant aux DTOs du Backend.

Exemple d'interface :
```typescript
export interface MotorQuote {
  id: string;
  quoteNumber: string;
  insuredName: string;
  vehicle: VehicleDetails;
  totalPremium: number;
  status: 'draft' | 'pending' | 'approved';
}
```
