# Concours de Tajwid – Notation des élèves

Application Next.js permettant à des jurys de noter des élèves lors d'un concours de Tajwid (récitation et mémorisation du Coran). Chaque formulaire comporte 10 critères notés sur 10, et les résultats sont centralisés dans **Supabase**.

## 🎯 Fonctionnalités

- **Accueil dynamique** : liste des 6 niveaux avec élèves chargés depuis Supabase
- **Formulaire de notation** : 10 critères notés sur 10, moyenne calculée en direct
- **Admin** : affichage des notes par niveau avec moyennes et détails des jurys
- **Gestion des élèves** : ajout/modification depuis Supabase sans redéploiement
- **Multi-device** : responsive (smartphone, tablette, laptop)
- **Gratuit** : Supabase (BDD) + Vercel/Netlify (hébergement)

## 📊 Niveaux disponibles

1. **Tajwid par récitation - Niveau 1** (فئة التجويد بالتلاوة : المستوى الأول)
2. **Tajwid par mémorisation - Niveau 1** (فئة التجويد بالحفظ : المستوى الأول)
3. **Tajwid par mémorisation - Niveau 2** (فئة التجويد بالحفظ : المستوى الثاني)
4. **Tajwid par mémorisation - Niveau préparatoire** (فئة التجويد بالحفظ : المستوى التحضيري)
5. **Tajwid par mémorisation - Niveau 3** (فئة التجويد بالحفظ : المستوى الثالث)
6. **Tajwid par mémorisation - Niveau 4** (فئة التجويد بالحفظ : المستوى الرابع)

## 🚀 Installation rapide

### 1. Cloner et installer
```bash
git clone <url-du-repo>
cd tajwid
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Dans l'éditeur SQL, exécutez le script `docs/supabase-setup.sql`
3. Récupérez vos clés API (Settings → API)

### 3. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Éditez `.env.local`. Voici les variables à avoir sous la main (le fichier [`.env.local.example`](.env.local.example) reprend les mêmes avec des commentaires) :

| Variable | Obligatoire | Rôle |
|----------|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Oui | URL du projet Supabase (Settings → API → Project URL). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Oui | Clé publique « anon » (Settings → API → anon public). |
| `PHASE_SAISIE` | Non* | Phase du concours pour la **saisie** des notes : `qualification`, `demi_finale` ou `finale`. Si absent ou invalide, la valeur par défaut est `demi_finale`. À définir sur l’hébergement (Vercel, etc.) quand vous changez de tour (pré-qualif → demi-finale → finale). |

\* Sans `PHASE_SAISIE`, l’app fonctionne quand même grâce au défaut ; en production, il est recommandé de la fixer explicitement pour éviter toute ambiguïté.

Exemple minimal :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votreprojet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
PHASE_SAISIE=demi_finale
```

**À quoi sert la « phase » ?** Le concours se déroule en plusieurs tours. Chaque note enregistrée en base est étiquetée avec la phase active au moment de la saisie (colonne `phase` sur les notes). Cela permet de distinguer les notes du pré-tour, de la demi-finale et de la finale sans mélanger les évaluations. La variable `PHASE_SAISIE` est lue côté serveur dans les pages et routes qui en ont besoin (valeur validée : `qualification`, `demi_finale` ou `finale`, sinon défaut `demi_finale`).

### 4. Lancer en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📝 Gestion des élèves

**Les élèves sont gérés directement dans Supabase** (pas besoin de modifier le code !)

### Ajouter un élève

**Via l'interface Supabase** :
1. Table Editor → `eleves` → Insert row
2. Remplissez :
  - `niveau` : `niveau2`
   - `nom` : `DUPONT`
   - `prenom` : `Marie`
   - `professeur` : `Mme MARTIN`
3. Save

**Via SQL** :
```sql
INSERT INTO eleves (niveau, nom, prenom, professeur)
VALUES ('niveau2', 'DUPONT', 'Marie', 'Mme MARTIN');
```

L'élève apparaît immédiatement sur le site !

📖 **Documentation complète** : [`docs/GESTION-ELEVES.md`](docs/GESTION-ELEVES.md)

## 📚 Documentation

- [`docs/GUIDE-RAPIDE.md`](docs/GUIDE-RAPIDE.md) : Configuration Supabase en 7 étapes
- [`docs/GESTION-ELEVES.md`](docs/GESTION-ELEVES.md) : Ajouter/modifier/supprimer des élèves
- [`docs/supabase-setup.sql`](docs/supabase-setup.sql) : Script SQL complet
- [`docs/deploiement.md`](docs/deploiement.md) : Déploiement Vercel/Netlify
- [`docs/choix-techno.md`](docs/choix-techno.md) : Comparaison des technologies

## 🏗️ Architecture

```
app/
├── page.tsx                        # Accueil (liste des niveaux/élèves)
├── notes/[niveau]/[eleve]/        # Formulaire de notation
├── admin/page.tsx                 # Tableau des notes par niveau
└── api/notes/route.ts             # API pour enregistrer les notes

data/
└── niveaux.ts                     # Configuration des niveaux (labels, couleurs)

lib/
├── supabase/client.ts             # Client Supabase
└── eleves.ts                      # Chargement dynamique des élèves

types/
└── supabase.ts                    # Types TypeScript de la base
```

### Base de données Supabase

- **`eleves`** : Nom, prénom, niveau, professeur
- **`notes`** : Évaluations des jurys (10 critères + moyenne)

## 🛠️ Technologies

- **Next.js 16** (App Router + TypeScript)
- **Tailwind CSS** (styling responsive)
- **Supabase** (Postgres + API REST gratuite)
- **Vercel/Netlify** (hébergement gratuit)

## 🚢 Déploiement

### Vercel (recommandé)

1. Poussez votre code sur GitHub
2. Importez le projet sur [Vercel](https://vercel.com)
3. Ajoutez les variables d’environnement (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, et idéalement `PHASE_SAISIE`)
4. Deploy !

Voir [`docs/GUIDE-RAPIDE.md`](docs/GUIDE-RAPIDE.md) pour plus de détails.

## 📊 Utilisation

### Pour les jurys

1. Accédez à l'URL du site
2. Sélectionnez le niveau puis l'élève
3. Remplissez les 10 critères (note sur 10 pour chaque)
4. Indiquez votre nom (jury)
5. Cliquez sur "Enregistrer la note"

### Pour les administrateurs

1. Allez sur `/admin`
2. Consultez les notes par niveau
3. Comparez les évaluations des différents jurys
4. Voyez les moyennes en temps réel

## 🔒 Sécurité

Les politiques RLS (Row Level Security) de Supabase permettent :
- ✅ Lecture publique des élèves et notes
- ✅ Insertion publique des notes
- ❌ Pas de modification/suppression des notes (sauf admin Supabase)

Pour restreindre l'accès, modifiez les politiques dans le script SQL.

## 📄 Licence

Projet associatif – usage libre.
