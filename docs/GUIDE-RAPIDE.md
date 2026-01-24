# Guide rapide - Configuration Supabase

## Étape 1 : Créer le projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet (gratuit)
3. Attendez que le projet soit créé (2-3 minutes)

## Étape 2 : Exécuter le script SQL

1. Dans votre projet Supabase, cliquez sur l'icône **SQL Editor** (à gauche)
2. Cliquez sur **New query**
3. Copiez-collez **tout le contenu** du fichier `docs/supabase-setup.sql`
4. Cliquez sur **Run** (ou appuyez sur Ctrl+Entrée)
5. Vérifiez que le message indique "Success. No rows returned"

Cela créera :
- ✅ La table `notes` pour stocker les évaluations
- ✅ La table `eleves` (optionnelle, les élèves sont déjà dans le code)
- ✅ Les index pour de meilleures performances
- ✅ Les politiques RLS pour autoriser l'accès

## Étape 3 : Récupérer les clés API

1. Cliquez sur l'icône **Settings** (⚙️ en bas à gauche)
2. Cliquez sur **API** dans le menu
3. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (dans "Project API keys") → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Étape 4 : Configurer l'application

1. Dans le dossier du projet, créez un fichier `.env.local` :
   ```bash
   cp .env.local.example .env.local
   ```

2. Éditez `.env.local` et remplacez les valeurs :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votreprojet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...votre_cle
   ```

## Étape 5 : Tester en local

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) et :
1. Cliquez sur un élève
2. Remplissez le formulaire
3. Cliquez sur "Enregistrer la note"
4. Allez sur `/admin` pour voir la note apparaître

## Étape 6 : Vérifier dans Supabase

1. Dans Supabase, cliquez sur **Table Editor**
2. Sélectionnez la table `notes`
3. Vous devriez voir la ligne que vous venez d'insérer

## Étape 7 : Déployer sur Vercel

1. Poussez votre code sur GitHub
2. Allez sur [https://vercel.com](https://vercel.com)
3. Cliquez sur **Import Project**
4. Sélectionnez votre dépôt GitHub
5. Dans **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Cliquez sur **Deploy**

Votre application sera disponible sur une URL publique en quelques minutes !

## Résolution de problèmes

### Erreur "Supabase URL et clé ANON doivent être définis"
→ Vérifiez que `.env.local` existe et contient les bonnes valeurs

### Erreur lors de l'insertion dans Supabase
→ Vérifiez que les politiques RLS sont activées (voir le script SQL)

### Les notes ne s'affichent pas dans /admin
→ Vérifiez dans Supabase Table Editor que les données sont bien insérées

### Page 404 pour un élève
→ Relancez `npm run build` pour régénérer les pages statiques
