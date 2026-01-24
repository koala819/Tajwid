# Déploiement & infra gratuite

## Supabase (gratuit)

1. Créez un projet Supabase (plan "Free").
2. Ajoutez une table `notes` avec ce schéma :
   | Colonne     | Type               | Remarques |
   |-------------|--------------------|-----------|
   | `id`        | `uuid`             | `primary key`, `default` : `gen_random_uuid()` |
   | `niveau`    | `text`             | niveau de la classe (ex. `CP`) |
   | `eleve`     | `text`             | nom de l’élève |
   | `jury`      | `text`             | identifiant du jury |
   | `total`     | `numeric`          | note sur 100 |
   | `moyenne`   | `numeric`          | moyenne sur 10 |
   | `scores`    | `jsonb`            | détail des 10 scores |
   | `recorded_at` | `timestamptz`     | `default` : `now()` |

3. **Sécurité** :
   - Vous pouvez garder RLS désactivé pour simplifier (les requêtes passent par l’API Next.js) ou activer RLS puis créer une politique `allow_api` qui autorise `auth.role = 'anon'`.
   - Si vous activez RLS, veillez à tester `SELECT`/`INSERT` depuis Supabase Studio et via l’API.

4. Dans les paramètres du projet Supabase, copiez :
   - `Supabase URL`
   - `Anon public` (clé)

5. Créez un fichier `.env.local` (non commité) avec :
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
   Les environnements de déploiement (Vercel, Netlify) doivent recevoir ces mêmes variables.

## Déploiement gratuit

### Vercel
1. Connectez votre dépôt GitHub/GitLab/Bitbucket.
2. Déployez la branche (par défaut `main` ou `master`).
3. Ajoutez les variables d’environnement (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) dans **Settings > Environment Variables**.
4. Vercel exécute automatiquement `npm install` puis `npm run build`. Les pages `app/notes/[niveau]/[eleve]/page.tsx` et `app/admin/page.tsx` fonctionnent immédiatement.

### Netlify
1. Créez un projet lié au dépôt GitHub.
2. Comme commande de build, utilisez `npm run build`.
3. Définissez les variables d’environnement dans **Site settings > Build & deploy > Environment**.

### GitHub Pages
1. GitHub Pages ne supporte pas directement Next.js App Router : préférez Vercel ou Netlify.

## Vérification

- Lancez `npm run dev` localement et vérifiez :
  - Formulaire (`/notes/cp/aicha` par exemple) : 10 champs + nom du jury.
  - Admin (`/admin`) : lecture des notes.
- Utilisez Supabase Studio pour visualiser les lignes stockées.
- Après chaque déploiement, vérifiez que les variables sont bien présentes dans Vercel/Netlify.
