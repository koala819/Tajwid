<!--
Documenter les implications de chaque stack pour les besoins du concours.
-->
# Choix technologique pour le formulaire de notation

## Objectifs principaux
- Une expérience fluide sur smartphone, tablette et laptop.
- Un formulaire riche (10 champs, note calculée) avec validation en direct.
- Stockage sécurisé des notes dans Supabase.
- Déploiement gratuit (Vercel, Netlify, GitHub Pages…).

## Options envisagées

### Vanilla JS + HTML
- **Avantages** : très léger, aucune dépendance, facile à héberger sur GitHub Pages ou Netlify. Contrôle absolu du DOM et de la logique.
- **Contraintes** : il faut gérer soi-même le routage, l’état du formulaire et les appels API. L’expérience responsive et le code deviennent vite verbeux pour un formulaire avancé.
- **Supabase** : nécessite un petit wrapper fetch, mais reste simple à implémenter.
- **Verdict** : viable pour un prototype très simple, mais manquera de structure si l’on ajoute des vues admin ou des calculs/validations complexes.

### Next.js (React + App Router)
- **Avantages** : rendu côté serveur possible (bonne perf), API routes intégrées pour écrire dans Supabase, gestion du routing dynamique pour les élèves/niveaux, large écosystème.
- **Contraintes** : plus lourd à configurer, mais l’investissement vaut la peine pour les vues multiples (formulaire + admin). Le client peut être déployé gratuitement sur Vercel (edge functions simplifiées).
- **Supabase** : s’intègre par une bibliothèque (supabase-js) dans `lib/supabase/client.ts`. Les insertions et lectures passent par API routes sécurisées.
- **Verdict** : excellent compromis entre rapidité de développement et capacité à évoluer (multi vues, filtres admin, calculs).

### Astro
- **Avantages** : le rendu est statique par défaut, bon pour les pages marketing ou documentation, mais peut embarquer des composants React pour la logique active.
- **Contraintes** : les interactions complexes (formulaires dynamiques) nécessitent du client JS additionnel ; la structure de répertoire peut être moins intuitive pour des API dynamiques.
- **Supabase** : fonctionne mais demande un endpoint serverless externe (ex. Netlify Function) pour éviter d’exposer les clefs côté client.
- **Verdict** : pertinent pour un content site simple, mais moins naturel pour des formulaires d’évaluation multi-utilisateurs.

### Autres alternatives légères
- **Prefresh/Routable sur Vite** : ultra rapide, mais réclame un certain scaffolding pour les pages multi-niveaux.
- **SvelteKit** : excellent pour des interactions légères, mais dépend d’une courbe d’apprentissage supérieure si l’équipe connaît déjà React.

## Recommandation
Choisir **Next.js** (avec TypeScript si possible) pour :
1. Gérer facilement le routing dynamique (`/notes/[niveau]/[eleve]`).
2. Bénéficier d’API routes pour écrire/consulter les notes Supabase de manière sécurisée.
3. Déployer gratuitement sur Vercel ou Netlify tout en conservant une expérience responsive sur mobile/tablette.
Un formulaire réactif et une admin simple sont plus faciles à structurer dans cette stack que dans un projet 100 % vanilla.
