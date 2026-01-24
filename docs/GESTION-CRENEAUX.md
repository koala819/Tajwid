# Guide : Ajouter des élèves pour les autres créneaux

## 🎯 Vue d'ensemble

Les 31 élèves actuellement en base sont du créneau **Samedi après-midi**.
Vous pouvez maintenant ajouter les élèves des autres créneaux.

## 📅 Créneaux disponibles

| Valeur | Label |
|--------|-------|
| `samedi-matin` | Samedi matin |
| `samedi-aprem` | Samedi après-midi (actuel) |
| `dimanche-matin` | Dimanche matin |
| `dimanche-aprem` | Dimanche après-midi |

## 🔧 Étape 1 : Migration (à faire une seule fois)

Exécutez le script dans Supabase SQL Editor :

```bash
# Copiez tout le contenu de docs/migration-creneau.sql
```

Ce script :
- ✅ Ajoute la colonne `creneau` à la table `eleves`
- ✅ Met "samedi-aprem" par défaut pour les élèves existants
- ✅ Crée un index pour les recherches rapides

## ➕ Étape 2 : Ajouter des élèves

### Option 1 : Via l'interface Supabase (recommandé)

1. Ouvrez **Table Editor** → `eleves`
2. Cliquez sur **Insert row**
3. Remplissez les champs :
   ```
   niveau: hifdh-niveau2
   nom: MARTIN
   prenom: Yasmine
   professeur: Mme BENALI
   creneau: samedi-matin    ← Important !
   ```
4. **Save**

### Option 2 : Via SQL (insertion en masse)

```sql
-- Exemple : Élèves du SAMEDI MATIN
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('tilawa-niveau1', 'MARTIN', 'Yasmine', 'Mme BENALI', 'samedi-matin'),
('hifdh-niveau1', 'BERNARD', 'Adam', 'Mr KARIM', 'samedi-matin'),
('hifdh-niveau2', 'DUPONT', 'Salma', 'Mme ZEKRI Laila', 'samedi-matin');

-- Exemple : Élèves du DIMANCHE MATIN
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('hifdh-niveau3', 'LECLERC', 'Bilal', 'Mr AHMED', 'dimanche-matin'),
('hifdh-niveau2', 'PETIT', 'Nour', 'Mme ATTOUIFALI', 'dimanche-matin');

-- Exemple : Élèves du DIMANCHE APRÈS-MIDI
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('tilawa-niveau1', 'MOREAU', 'Inès', 'Mme LABID Fadoua', 'dimanche-aprem'),
('hifdh-niveau4', 'DUBOIS', 'Youssef', 'Mr JAMMEL Youssef', 'dimanche-aprem');
```

## 📊 Étape 3 : Vérifier dans l'interface

Après avoir ajouté des élèves, ils apparaissent dans l'application :

1. **Page d'accueil** : Filtres par créneau en haut
   ```
   [Tous les créneaux] [Samedi matin] [Samedi après-midi] [Dimanche matin] [Dimanche après-midi]
   ```

2. **Cliquez sur un filtre** pour voir uniquement les élèves de ce créneau

3. **Navigation** :
   - `http://localhost:3000/` → Tous les créneaux
   - `http://localhost:3000/?creneau=samedi-matin` → Samedi matin
   - `http://localhost:3000/?creneau=dimanche-aprem` → Dimanche après-midi

## 🔍 Requêtes utiles

### Compter les élèves par créneau
```sql
SELECT 
  creneau,
  COUNT(*) as nb_eleves
FROM eleves
GROUP BY creneau
ORDER BY 
  CASE creneau
    WHEN 'samedi-matin' THEN 1
    WHEN 'samedi-aprem' THEN 2
    WHEN 'dimanche-matin' THEN 3
    WHEN 'dimanche-aprem' THEN 4
  END;
```

### Voir tous les élèves d'un créneau
```sql
SELECT 
  nom,
  prenom,
  niveau,
  professeur
FROM eleves
WHERE creneau = 'samedi-matin'
ORDER BY niveau, nom;
```

### Copier tous les élèves vers un autre créneau (exemple)
```sql
-- ATTENTION : Ceci duplique les élèves !
-- Utilisez uniquement si vous voulez les mêmes élèves sur plusieurs créneaux
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau)
SELECT niveau, nom, prenom, professeur, 'dimanche-matin'
FROM eleves
WHERE creneau = 'samedi-aprem';
```

## 📝 Import CSV

Si vous avez un fichier CSV avec vos élèves :

**Format du CSV :**
```csv
niveau,nom,prenom,professeur,creneau
hifdh-niveau2,MARTIN,Yasmine,Mme BENALI,samedi-matin
hifdh-niveau3,DUPONT,Adam,Mr KARIM,samedi-matin
tilawa-niveau1,BERNARD,Salma,Mme ZEKRI,dimanche-matin
```

**Import dans Supabase :**
1. Table Editor → `eleves`
2. Cliquez sur **Import data**
3. Sélectionnez votre CSV
4. **Import**

## 🎨 Interface utilisateur

L'interface s'adapte automatiquement :
- ✅ **Filtres dynamiques** en haut de la page
- ✅ **Compteur de participants** par créneau
- ✅ **Niveaux vides cachés** si aucun élève
- ✅ **Message "Aucun participant"** si créneau vide

## ⚠️ Important

- Le champ `creneau` est **obligatoire** maintenant
- Les élèves existants ont automatiquement `samedi-aprem`
- Vous pouvez avoir le même élève sur plusieurs créneaux (dupliquer la ligne avec un `creneau` différent)
- Les notes sont liées au nom complet, pas à l'ID, donc un élève peut avoir des notes sur plusieurs créneaux

## 🚀 Exemple complet

```sql
-- 1. Exécuter la migration (docs/migration-creneau.sql)

-- 2. Ajouter des élèves pour samedi matin
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('tilawa-niveau1', 'NOUVEAU', 'Élève1', 'Prof A', 'samedi-matin'),
('hifdh-niveau2', 'NOUVEAU', 'Élève2', 'Prof B', 'samedi-matin');

-- 3. Vérifier
SELECT creneau, COUNT(*) FROM eleves GROUP BY creneau;

-- 4. Tester dans l'app
-- → Aller sur http://localhost:3000
-- → Cliquer sur "Samedi matin"
-- → Les nouveaux élèves apparaissent !
```

Voilà ! Vous pouvez maintenant gérer les 4 créneaux indépendamment. 🎉
