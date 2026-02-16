# 🎯 Système de Publication des Résultats

## Vue d'ensemble

Système complet pour gérer les évaluations des jurys et publier les résultats finaux du concours.

## 📊 Architecture

### Base de données

Table `notes` avec nouveaux champs :
- `publie` (BOOLEAN) - Résultat publié ou non
- `date_publication` (TIMESTAMPTZ) - Date de publication

### Règle de validation
**Un résultat final nécessite exactement 2 jurys minimum**

## 🔐 Authentification

### Accès Admin
- Login : `root`
- Mot de passe : `ihsane26`
- Route : `/login`

### Modification des notes
Deux mots de passe valides :
- `ght1vtt9`
- `gtoqpaht1vtt`

## 📱 Pages

### 1. Page Admin (`/admin`) - Authentification requise

#### Onglets par niveau
```
[ Préparatoire ] [ Niveau 1 ] [ Niveau 2 ] [ Niveau 3 ] [ Niveau 4 ]
```

#### Vue par élève
```
┌─────────────────────────────────────────┐
│ Rayan BOUCHLAGHEM                       │
│                                         │
│ 🟡 Jury 1: Mme Fatima     95/100       │
│    [Modifier]                           │
│                                         │
│ 🟡 Jury 2: M. Ahmed       97/100       │
│    [Modifier]                           │
│                                         │
│ ─────────────────────────────────       │
│ RÉSULTAT FINAL: 96/100                  │
│ (Moyenne de 2 jurys)                    │
│                                         │
│ Publier : [OFF] ←→ [ON]                │
└─────────────────────────────────────────┘
```

#### Fonctionnalités
- ✅ Onglets pour naviguer entre les niveaux
- ✅ Compteur de notes par niveau
- ✅ Vue groupée par élève
- ✅ Calcul automatique de la moyenne (2 jurys minimum)
- ✅ Bouton "Modifier" pour chaque note de jury
- ✅ Modal avec mot de passe pour modifier
- ✅ Possibilité de modifier le total ou supprimer
- ✅ Switch "Publier/Dépublier" par élève
- ✅ Lien vers la page publique

#### États d'un élève
- **En attente** : Moins de 2 jurys → Badge orange "En attente du 2e jury"
- **Prêt** : 2 jurys ou plus → Affiche le résultat final et le switch de publication
- **Publié** : Switch activé → Visible sur `/resultats`

### 2. Page Résultats Publics (`/resultats`) - Accès public

#### Affichage
- Liste des résultats publiés uniquement
- Classement par niveau
- Tri par note décroissante dans chaque niveau
- Affichage élégant avec rang (1, 2, 3...)

#### Informations affichées
- Nom de l'élève
- Note finale / 100
- Nombre de jurys ayant noté

## 🛠️ Workflow complet

### 1. Saisie des notes (Jurys)
1. Jury 1 évalue l'élève → Note enregistrée (non publiée)
2. Jury 2 évalue l'élève → Note enregistrée (non publiée)
3. **Résultat final calculé automatiquement**

### 2. Validation (Admin)
1. Admin se connecte (`/login`)
2. Va sur `/admin`
3. Sélectionne le niveau via les onglets
4. Voit les élèves avec leurs notes
5. **Si besoin** : Modifie une note (avec mot de passe)
6. **Si 2 jurys** : Active le switch "Publier"

### 3. Publication
1. Switch activé → `publie = true` dans la base
2. Date de publication enregistrée
3. Résultat visible sur `/resultats`

### 4. Consultation publique
1. Parents/visiteurs vont sur `/resultats`
2. Voient uniquement les résultats publiés
3. Classement par niveau et par note

## 🔧 APIs créées

### `/api/notes/update` (POST)
Modifier le total d'une note
```json
{
  "id": "uuid",
  "total": 95,
  "moyenne": 9.5
}
```

### `/api/notes/delete` (POST)
Supprimer une note
```json
{
  "id": "uuid"
}
```

### `/api/notes/publish` (POST)
Publier/dépublier les notes d'un élève
```json
{
  "noteIds": ["uuid1", "uuid2"],
  "publie": true
}
```

## 📋 Migration SQL

Exécutez dans Supabase :
```bash
docs/migration-publication.sql
```

Cela ajoute :
- Colonne `publie` (BOOLEAN)
- Colonne `date_publication` (TIMESTAMPTZ)
- Index pour les performances

## 🎨 Design

- **Sobre et chaleureux** : Tons stone/beige avec accents ambre
- **Onglets modernes** : Navigation fluide entre les niveaux
- **Badges de statut** : "Jury 1", "Jury 2", "En attente"
- **Switch élégant** : Toggle OFF/ON pour publier
- **Modal sécurisé** : Authentification pour modifier

## 🚀 Utilisation

### Première utilisation
1. Exécutez la migration SQL dans Supabase
2. Démarrez l'application : `npm run dev`
3. Les jurys notent les élèves (via `/creneau/...`)
4. Admin se connecte et publie les résultats

### Publication d'un résultat
1. Aller sur `/admin`
2. Sélectionner le niveau
3. Vérifier que l'élève a 2 jurys
4. Activer le switch "Publier"
5. Le résultat apparaît sur `/resultats`

### Modification d'une note (erreur)
1. Cliquer sur "Modifier" à côté d'une note de jury
2. Entrer le mot de passe : `ght1vtt9` ou `gtoqpaht1vtt`
3. Modifier le total
4. Enregistrer ou Supprimer

## ⚠️ Important

- **2 jurys minimum** : Un résultat final n'est calculé et publiable que si au moins 2 jurys ont noté
- **Modification sécurisée** : Requiert un mot de passe différent de l'admin
- **Publication réversible** : On peut dépublier un résultat
- **Traçabilité** : Date de publication enregistrée

## 🎉 Résultat

Un système professionnel et sécurisé pour :
- ✅ Gérer les évaluations de plusieurs jurys
- ✅ Calculer automatiquement les moyennes
- ✅ Modifier/Supprimer en cas d'erreur
- ✅ Publier de manière contrôlée
- ✅ Afficher les résultats au public

Parfait pour un concours officiel !
