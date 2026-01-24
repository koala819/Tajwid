-- ========================================
-- MIGRATION : Ajout du champ créneau
-- ========================================

-- Ajouter la colonne creneau à la table eleves
ALTER TABLE eleves 
ADD COLUMN IF NOT EXISTS creneau TEXT DEFAULT 'samedi-aprem';

-- Créer un index pour recherche rapide par créneau
CREATE INDEX IF NOT EXISTS idx_eleves_creneau ON eleves(creneau);

-- Mettre à jour les élèves existants (déjà en base = samedi après-midi)
UPDATE eleves 
SET creneau = 'samedi-aprem' 
WHERE creneau IS NULL OR creneau = '';

-- ========================================
-- EXEMPLES d'insertion pour les autres créneaux
-- ========================================

-- Exemple : Ajouter un élève pour SAMEDI MATIN
-- INSERT INTO eleves (niveau, nom, prenom, professeur, creneau)
-- VALUES ('hifdh-niveau2', 'MARTIN', 'Yasmine', 'Mme BENALI', 'samedi-matin');

-- Exemple : Ajouter un élève pour DIMANCHE MATIN
-- INSERT INTO eleves (niveau, nom, prenom, professeur, creneau)
-- VALUES ('hifdh-niveau3', 'AHMED', 'Bilal', 'Mr KARIM', 'dimanche-matin');

-- Exemple : Ajouter un élève pour DIMANCHE APRÈS-MIDI
-- INSERT INTO eleves (niveau, nom, prenom, professeur, creneau)
-- VALUES ('tilawa-niveau1', 'LECLERC', 'Salma', 'Mme ZEKRI Laila', 'dimanche-aprem');

-- ========================================
-- VALEURS POSSIBLES pour le champ creneau
-- ========================================
-- 'samedi-matin'    : Samedi matin
-- 'samedi-aprem'    : Samedi après-midi (par défaut)
-- 'dimanche-matin'  : Dimanche matin
-- 'dimanche-aprem'  : Dimanche après-midi

-- ========================================
-- REQUÊTES UTILES
-- ========================================

-- Compter les élèves par créneau
-- SELECT creneau, COUNT(*) as nb_eleves
-- FROM eleves
-- GROUP BY creneau
-- ORDER BY creneau;

-- Voir tous les élèves d'un créneau spécifique
-- SELECT nom, prenom, niveau, professeur
-- FROM eleves
-- WHERE creneau = 'samedi-aprem'
-- ORDER BY niveau, nom;

-- Voir tous les créneaux disponibles
-- SELECT DISTINCT creneau, COUNT(*) as nb_eleves
-- FROM eleves
-- GROUP BY creneau
-- ORDER BY 
--   CASE creneau
--     WHEN 'samedi-matin' THEN 1
--     WHEN 'samedi-aprem' THEN 2
--     WHEN 'dimanche-matin' THEN 3
--     WHEN 'dimanche-aprem' THEN 4
--     ELSE 5
--   END;
