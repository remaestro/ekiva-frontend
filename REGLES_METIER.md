# 🧮 Règles Métier et Algorithmes de Calcul

Ce document centralise les règles de calcul pour les primes d'assurance, les taxes et les commissions.

## 1. Assurance Automobile (Motor Insurance)

### 1.1 Algorithme de Calcul de Prime

Le calcul de la prime automobile suit la séquence suivante :

1.  **Prime de Base**
    $$ \text{BasePremium} = \text{ValeurVéhicule} \times \text{RatingFactor} $$
    *Le `RatingFactor` dépend de la puissance fiscale (CV) et du type de carburant (voir 1.2).*

2.  **Prime des Sections (Garanties)**
    $$ \text{SectionsPremium} = \sum (\text{PrimeFixe}_{\text{garanties\_sélectionnées}}) $$
    *Exemple: Défense et Recours (5,000), Bris de Glace (5,000), etc.*

3.  **Sous-Total**
    $$ \text{Subtotal} = \text{BasePremium} + \text{SectionsPremium} $$

4.  **Remises (Discounts)**
    $$ \text{TotalDiscount} = \text{Subtotal} \times (\text{ProfessionalDiscount\%} + \text{CommercialDiscount\%}) $$
    $$ \text{NetPremium}_{\text{intermédiaire}} = \text{Subtotal} - \text{TotalDiscount} $$

5.  **Ajustement Court Terme**
    Si la durée est inférieure à 12 mois :
    $$ \text{NetPremium} = \text{NetPremium}_{\text{intermédiaire}} \times \text{ShortTermFactor} $$
    *Voir table 1.4 pour les facteurs.*

6.  **Taxes**
    $$ \text{TaxAmount} = \text{NetPremium} \times 14.5\% $$

7.  **Frais Accessoires (Policy Cost)**
    Dépend de la tranche de prime nette (voir 1.3).

8.  **Prime Totale**
    $$ \text{TotalPremium} = \text{NetPremium} + \text{TaxAmount} + \text{PolicyCost} $$

### 1.2 Facteurs de Tarification (Rating Factors)

| Puissance (CV) | Essence | Diesel |
| :--- | :--- | :--- |
| 4-7 CV | 2.50% | 2.50% |
| 8-9 CV | 3.00% | 3.00% |
| 10-11 CV | 3.50% | 3.50% |
| 12-14 CV | 4.00% | 4.00% |
| 15-20 CV | 5.00% | 5.00% |
| 21+ CV | 6.00% | 6.00% |

### 1.3 Frais Accessoires (Policy Costs)

| Prime Nette Min | Prime Nette Max | Frais |
| :--- | :--- | :--- |
| 0 | 25,000 | 1,000 FCFA |
| 25,001 | 50,000 | 1,500 FCFA |
| 50,001 | 75,000 | 2,000 FCFA |
| 75,001 | 100,000 | 2,500 FCFA |
| 100,001+ | - | 3,000 FCFA |

### 1.4 Coefficients Court Terme

| Mois | Coefficient |
| :--- | :--- |
| 1 | 0.25 |
| 3 | 0.40 |
| 6 | 0.70 |
| 9 | 0.85 |
| 12 | 1.00 |

---

## 2. RC Artisans et Commerce (Liability)

### 2.1 Algorithme de Calcul

1.  **Prime de Base (Base Premium)**
    Dépend de la classe tarifaire (1-6) et du nombre d'employés.
    - Si employés ≤ 5 : Prime forfaitaire de la classe.
    - Si employés > 5 : Prime forfaitaire + (Employés supp. × Coût par employé).

2.  **Prime Biens Confiés (Entrusted Goods)**
    $$ \text{EntrustedPremium} = \text{BasePremium} \times \text{Coefficient} $$
    *Le coefficient dépend de la limite de garantie (1M ou 4M) et de la valeur résiduelle (Forte, Moyenne, Faible, Nulle).*
    *Il existe une prime minimum pour cette garantie (50,000 ou 100,000 FCFA).*

3.  **Prime Pure Totale**
    $$ \text{TotalPurePremium} = \text{BasePremium} + \text{EntrustedPremium} $$

4.  **Taxes et Frais**
    - Taxe (25% - Catégorie Incendie) : $$ \text{TaxAmount} = \text{TotalPurePremium} \times 0.25 $$
    - Frais de contrôle (1.25%) : $$ \text{FeeAmount} = \text{TotalPurePremium} \times 0.0125 $$

5.  **Prime Totale**
    $$ \text{TotalPremium} = \text{TotalPurePremium} + \text{TaxAmount} + \text{FeeAmount} $$

### 2.2 Grille Tarifaire Simplifiée

| Classe | Prime Base (≤5 emp.) | Prime/emp. supp. |
| :--- | :--- | :--- |
| 1 | 80,000 FCFA | 7,500 FCFA |
| 2 | 100,000 FCFA | 10,000 FCFA |
| ... | ... | ... |
| 6 | 175,000 FCFA | 23,000 FCFA |

---

## 3. Commissions et Taxes

### 3.1 Calcul de la Commission

$$ \text{Commission} = (\text{NetPremium} - \text{LifePremium}) \times \text{TauxCommission} $$

**Taux par type de distributeur :**
- Agent Interne : 10%
- Courtier (Broker) : 12.5%
- Agent Général : 15%
- Bancassurance : 8%

### 3.2 Taxe de Mandat

Applicable uniquement aux **Agents Mandataires**.
$$ \text{TaxeMandat} = \text{Commission} \times 7.5\% $$

### 3.3 Taxes Réglementaires (CIMA)

| Produit | Taux Taxe | Frais Contrôle |
| :--- | :--- | :--- |
| Automobile | 14.5% | 1.25% |
| Incendie | 25.0% | 1.25% |
| RC Générale | 14.5% | 1.25% |
| Transport | 7.0% - 14.5% | 1.25% |
