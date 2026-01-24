# 🎉 Application de notation - Concours de Tajwid

Application complète pour la notation des élèves lors d'un concours de Tajwid, avec gestion dynamique des élèves depuis Supabase.

## ✨ Fonctionnalités principales

### 1. Formulaire officiel de notation (13 critères / 100 points)
- ✅ **13 critères** de Tajwid en arabe et français
- ✅ **Pondération officielle** : 3 critères à 30 points, 10 critères à 5 points
- ✅ **Validation automatique** : limites par critère
- ✅ **Calcul en temps réel** du total sur 100
- ✅ **Zone observations** pour commentaires
- ✅ **Format conforme** au document officiel

### 2. Gestion dynamique des élèves
- ✅ **Chargement depuis Supabase** (plus besoin de redéployer)
- ✅ **Ajout/modification** via interface Supabase
- ✅ **31 élèves pré-enregistrés** dans 6 niveaux
- ✅ **Affichage des professeurs**

### 3. Interface responsive
- ✅ **Smartphone** : vue adaptée avec scroll
- ✅ **Tablette** : interface optimisée
- ✅ **Laptop/Desktop** : affichage complet

### 4. Panneau admin
- ✅ **Consultation par niveau** des notes
- ✅ **Moyennes calculées** automatiquement
- ✅ **Comparaison des jurys**
- ✅ **Horodatage** des évaluations

## 📊 Structure des critères

### Critères principaux (30 points chacun)
1. **الاحتراز من اللحن الجلي** - Éviter les erreurs évidentes
2. **النطق الصحيح للحروف** - Prononciation correcte des lettres
3. **الحفظ** - Mémorisation

### Critères secondaires (5 points chacun)
- Modération de la récitation
- Confiance du récitant
- Règles de pause/reprise
- Emphatisation/Atténuation
- Allongements (Mudud)
- Noun Sakin et Tanwin
- Mim Sakin
- Noun et Mim accentués
- Iqlab
- Qalqala

## 🗂️ Architecture

```
tajwid/
├── app/
│   ├── page.tsx                    # Accueil (liste élèves par niveau)
│   ├── notes/[niveau]/[eleve]/     # Formulaire de notation
│   ├── admin/page.tsx              # Tableau des résultats
│   └── api/notes/route.ts          # API d'enregistrement
├── components/
│   └── FormulaireNotes.tsx         # Formulaire officiel 13 critères
├── data/
│   └── niveaux.ts                  # Config des niveaux (labels, couleurs)
├── lib/
│   ├── supabase/client.ts          # Client Supabase
│   └── eleves.ts                   # Chargement dynamique élèves
├── types/
│   └── supabase.ts                 # Types TypeScript
└── docs/
    ├── GUIDE-RAPIDE.md             # Setup en 7 étapes
    ├── GESTION-ELEVES.md           # Gérer les élèves
    ├── FORMULAIRE.md               # Détails du formulaire
    ├── supabase-setup.sql          # Script SQL complet
    └── deploiement.md              # Déploiement Vercel/Netlify
```

## 🚀 Démarrage rapide

### 1. Installation
```bash
git clone <repo>
cd tajwid
npm install
```

### 2. Configuration Supabase
1. Créez un projet sur [supabase.com](https://supabase.com)
2. Exécutez `docs/supabase-setup.sql` dans l'éditeur SQL
3. Récupérez vos clés API

### 3. Variables d'environnement
```bash
cp .env.local.example .env.local
# Éditez .env.local avec vos clés Supabase
```

### 4. Lancement
```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📝 Utilisation

### Pour les jurys
1. Sélectionnez le niveau puis l'élève
2. Remplissez les 13 critères (respectez les maximums)
3. Ajoutez des observations (optionnel)
4. Indiquez votre nom
5. Enregistrez

### Pour les administrateurs

#### Consulter les notes
- `/admin` : Tableau des résultats par niveau

#### Ajouter un élève
1. Supabase → Table Editor → `eleves` → Insert row
2. Remplissez : `niveau`, `nom`, `prenom`, `professeur`
3. L'élève apparaît immédiatement !

## 🔧 Technologies

- **Next.js 16** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling responsive
- **Supabase** - Base de données Postgres + API
- **Vercel/Netlify** - Hébergement gratuit

## 📖 Documentation complète

- [`README.md`](README.md) - Vue d'ensemble
- [`docs/GUIDE-RAPIDE.md`](docs/GUIDE-RAPIDE.md) - Installation pas à pas
- [`docs/GESTION-ELEVES.md`](docs/GESTION-ELEVES.md) - Gérer les inscriptions
- [`docs/FORMULAIRE.md`](docs/FORMULAIRE.md) - Détails du formulaire officiel
- [`docs/supabase-setup.sql`](docs/supabase-setup.sql) - Script de création BDD
- [`docs/deploiement.md`](docs/deploiement.md) - Déployer en production

## 🎯 Points clés

### ✅ Avantages
- Formulaire conforme au format officiel
- Gestion flexible des élèves (sans redéploiement)
- 100% gratuit (Supabase + Vercel)
- Responsive (tous appareils)
- Calculs automatiques
- Historique complet des évaluations

### 🔐 Sécurité
- Politiques RLS Supabase configurées
- Lecture publique autorisée
- Insertion publique autorisée
- Modification/suppression réservée aux admins

### 📊 Données stockées
- **Table `eleves`** : 31 élèves pré-insérés
- **Table `notes`** : Évaluations avec 13 critères + observations

## 🌐 Déploiement

### Vercel (recommandé)
```bash
git push
# Importez sur vercel.com
# Ajoutez les variables d'environnement
# Deploy !
```

Votre app sera sur `https://votre-app.vercel.app`

## 📧 Support

Pour toute question :
- Consultez la documentation dans `/docs`
- Vérifiez les commentaires dans le code
- Testez avec `npm run dev` en local

---

**Prêt pour le concours !** 🎉
