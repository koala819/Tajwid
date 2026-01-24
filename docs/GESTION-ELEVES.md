# Gestion des élèves

## ✅ Nouvelle architecture (RECOMMANDÉ)

Les élèves sont maintenant **chargés dynamiquement depuis Supabase**. Cela signifie que :

### Avantages
- ✅ Ajout/modification d'élèves **sans redéploiement**
- ✅ Gestion directe dans Supabase (interface web)
- ✅ Flexibilité totale pour les inscriptions
- ✅ Plusieurs administrateurs peuvent gérer les élèves

### Comment ça fonctionne

1. **Les niveaux** (configuration) sont dans `data/niveaux.ts` :
   - Labels français et arabes
   - Couleurs
   - Descriptions
   - Slugs (identifiants)

2. **Les élèves** sont dans la table Supabase `eleves` :
   - `niveau` : slug du niveau (ex: 'hifdh-niveau2')
   - `nom` : nom de famille
   - `prenom` : prénom
   - `professeur` : nom du professeur (optionnel)

3. **Chargement dynamique** via `lib/eleves.ts` :
   - Au chargement de la page, les élèves sont récupérés de Supabase
   - Ils sont regroupés par niveau automatiquement

## Comment ajouter un élève

### Option 1 : Via l'interface Supabase (recommandé)

1. Ouvrez votre projet Supabase
2. Cliquez sur **Table Editor** → **eleves**
3. Cliquez sur **Insert row**
4. Remplissez les champs :
   ```
   niveau: hifdh-niveau2
   nom: DUPONT
   prenom: Marie
   professeur: Mme MARTIN
   ```
5. Cliquez sur **Save**

L'élève apparaîtra immédiatement sur le site (rechargez la page) !

### Option 2 : Via SQL

```sql
INSERT INTO eleves (niveau, nom, prenom, professeur)
VALUES ('hifdh-niveau2', 'DUPONT', 'Marie', 'Mme MARTIN');
```

## Comment modifier un élève

1. Dans Supabase, cliquez sur **Table Editor** → **eleves**
2. Trouvez l'élève à modifier
3. Cliquez sur la ligne pour éditer
4. Modifiez les champs nécessaires
5. Cliquez sur **Save**

## Comment supprimer un élève

1. Dans Supabase, cliquez sur **Table Editor** → **eleves**
2. Trouvez l'élève à supprimer
3. Cliquez sur l'icône **poubelle** à droite de la ligne
4. Confirmez la suppression

⚠️ **Attention** : Les notes associées à cet élève resteront dans la base mais ne seront plus accessibles via l'interface.

## Slugs des niveaux disponibles

Pour ajouter un élève, utilisez un de ces slugs dans le champ `niveau` :

| Slug | Niveau |
|------|--------|
| `tilawa-niveau1` | Tajwid par récitation - Niveau 1 |
| `hifdh-niveau1` | Tajwid par mémorisation - Niveau 1 |
| `hifdh-niveau2` | Tajwid par mémorisation - Niveau 2 |
| `hifdh-preparatoire` | Tajwid par mémorisation - Niveau préparatoire |
| `hifdh-niveau3` | Tajwid par mémorisation - Niveau 3 |
| `hifdh-niveau4` | Tajwid par mémorisation - Niveau 4 |

## Structure de la base

### Table `eleves`

```sql
CREATE TABLE eleves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niveau TEXT NOT NULL,           -- Ex: 'hifdh-niveau2'
  nom TEXT NOT NULL,               -- Ex: 'DUPONT'
  prenom TEXT NOT NULL,            -- Ex: 'Marie'
  professeur TEXT,                 -- Ex: 'Mme MARTIN' (optionnel)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table `notes`

Les notes utilisent le nom complet de l'élève (construit comme `nom + prenom`).
Cela permet de garder l'historique même si un élève est supprimé de la table `eleves`.

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niveau TEXT NOT NULL,            -- Ex: 'hifdh-niveau2'
  eleve TEXT NOT NULL,             -- Ex: 'DUPONT Marie'
  jury TEXT NOT NULL,
  total NUMERIC NOT NULL,
  moyenne NUMERIC NOT NULL,
  scores JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Import en masse

Pour importer plusieurs élèves d'un coup depuis un CSV :

1. Dans Supabase, cliquez sur **Table Editor** → **eleves**
2. Cliquez sur **Import data**
3. Sélectionnez votre fichier CSV avec les colonnes : `niveau,nom,prenom,professeur`
4. Cliquez sur **Import**

Exemple de CSV :
```csv
niveau,nom,prenom,professeur
hifdh-niveau2,DUPONT,Marie,Mme MARTIN
hifdh-niveau2,BERNARD,Paul,Mme MARTIN
hifdh-niveau3,LEFEBVRE,Sara,Mr AHMED
```
