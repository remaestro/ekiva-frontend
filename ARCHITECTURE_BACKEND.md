# 🏗️ Architecture Backend (.NET 8)

## 1. Architecture Globale

Le backend suit les principes de la **Clean Architecture** pour assurer la maintenabilité, la testabilité et l'indépendance vis-à-vis des frameworks externes.

### Structure de la Solution

```
Ekiva.Solution/
├── src/
│   ├── Ekiva.API/            # Couche Présentation (API REST)
│   ├── Ekiva.Core/           # Couche Domaine (Entités, Interfaces, Règles métier)
│   ├── Ekiva.Application/    # Couche Application (Cas d'utilisation, DTOs, Services)
│   └── Ekiva.Infrastructure/ # Couche Infrastructure (EF Core, Services externes)
└── tests/
    ├── Ekiva.UnitTests/
    └── Ekiva.IntegrationTests/
```

## 2. Détail des Couches

### 2.1 Ekiva.Core (Domaine)
C'est le cœur de l'application. Elle ne dépend d'aucun autre projet.
- **Entities**: Classes POCO représentant les tables de la BDD (`Profile`, `Quote`, `Policy`, etc.).
- **Enums**: `AppRole`, `DistributorType`, `PolicyStatus`.
- **Interfaces**: Contrats pour les repositories (`IRepository<T>`) et services domaine.
- **Specifications**: Pattern Specification pour les requêtes complexes.

### 2.2 Ekiva.Application
Contient la logique applicative.
- **DTOs**: Objets de transfert de données (ex: `CreateQuoteDto`, `QuoteSummaryDto`).
- **Services**: Implémentation de la logique métier (ex: `MotorPremiumCalculationService`).
- **Validators**: Validation FluentValidation (ex: `CreateQuoteValidator`).
- **Mappings**: Profils AutoMapper.
- **Interfaces**: Contrats pour les services d'infrastructure (ex: `IEmailService`, `IPdfService`).

### 2.3 Ekiva.Infrastructure
Implémente les interfaces définies dans Core et Application.
- **Data**: `EkivaDbContext`, Configurations EF Core, Migrations.
- **Repositories**: Implémentation de `IRepository<T>`.
- **Services**: Implémentations concrètes (ex: `EmailService`, `IdentityService`).
- **External APIs**: Clients pour les API tierces (ex: ASACI).

### 2.4 Ekiva.API
Point d'entrée de l'application.
- **Controllers**: Endpoints RESTful.
- **Middleware**: Gestion globale des erreurs, Logging, Authentification.
- **Extensions**: Configuration de l'injection de dépendances.

## 3. Stack Technologique

- **Framework**: .NET 8
- **API**: ASP.NET Core Web API
- **ORM**: Entity Framework Core 8
- **Base de données**: SQL Server 2022
- **Authentification**: ASP.NET Core Identity + JWT Bearer
- **Validation**: FluentValidation
- **Mapping**: AutoMapper
- **Documentation**: Swagger / OpenAPI
- **Logging**: Serilog

## 4. Sécurité

### 4.1 Authentification
- Utilisation de **JWT (JSON Web Tokens)**.
- Tokens signés avec une clé secrète forte.
- Refresh Tokens pour maintenir la session.

### 4.2 Autorisation
- **Role-Based Access Control (RBAC)**:
  - `Admin`: Accès total.
  - `Broker`: Création de devis, gestion de ses clients.
  - `User`: Accès limité (si applicable).
- **Policies**: Règles d'accès fines (ex: `CanEditQuote`).

## 5. Modèle de Données (Vue d'ensemble)

Le modèle de données est centré autour des entités principales :
- **Utilisateurs**: `Profiles`, `UserRoles`.
- **Clients**: `Clients` (Individus ou Entreprises).
- **Produits**: `MotorProducts`, `LiabilityProducts`.
- **Devis & Polices**: `Quotes`, `Policies`.
- **Référentiels**: `VehicleMakes`, `Currencies`, `Distributors`.

*(Voir le fichier SQL complet pour le schéma détaillé)*

## 6. API Endpoints Principaux

### Motor Insurance
- `POST /api/motor/quotes`: Créer un devis.
- `POST /api/motor/calculate-premium`: Calculer une prime (sans sauvegarder).
- `POST /api/motor/quotes/{id}/convert`: Convertir un devis en police.

### Liability Insurance
- `POST /api/liability/quotes`: Créer un devis RC.
- `POST /api/liability/calculate-premium`: Calculer une prime RC.

### Administration
- `GET /api/admin/dashboard`: Statistiques globales.
- `PUT /api/admin/products/{id}`: Modifier un produit.
