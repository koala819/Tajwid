-- ========================================
-- INSERTION DES ÉLÈVES DU DIMANCHE APRÈS-MIDI
-- Total : 20 élèves
-- ========================================

-- Niveau : فئة التجويد بالتلاوة : المستوى الأول (7 élèves)
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('tilawa-niveau1', '?', 'Ahmad', 'Mme EL KOUNNA Hajjar', 'dimanche-aprem'),
('tilawa-niveau1', '?', 'Ibrahim', 'Mme EL KOUNNA Hajjar', 'dimanche-aprem'),
('tilawa-niveau1', 'ALLAOUI', 'Marouane', 'Mme EL KOUNNA Hajjar', 'dimanche-aprem'),
('tilawa-niveau1', 'BAAHMED', 'Noam', 'Mme EL KOUNNA Hajjar', 'dimanche-aprem'),
('tilawa-niveau1', 'EL ADLOUNI', 'Imran', 'Mme EL KOUNNA Hajjar', 'dimanche-aprem'),
('tilawa-niveau1', 'LAMHAMDI', 'Ahmed', 'Mme LAKHLOUFI Faiza', 'dimanche-aprem'),
('tilawa-niveau1', 'MOUSSAOUI', 'Ilyes', 'Mme LAKHLOUFI Faiza', 'dimanche-aprem');

-- Niveau : فئة التجويد بالحفظ : المستوى التحضيري (10 élèves)
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('hifdh-preparatoire', 'ASSADI', 'Nour', 'Mme TRAORE Fatiha', 'dimanche-aprem'),
('hifdh-preparatoire', 'AZIRIA', 'Wassim', 'Mme TRAORE Fatiha', 'dimanche-aprem'),
('hifdh-preparatoire', 'DRAGHA', 'Isra', 'Mme Sahar', 'dimanche-aprem'),
('hifdh-preparatoire', 'DRIA', 'Luayy miloud', 'Mme LABID Fadoua', 'dimanche-aprem'),
('hifdh-preparatoire', 'FIKRI', 'Jenna', 'Mme TRAORE Fatiha', 'dimanche-aprem'),
('hifdh-preparatoire', 'JEDOUT', 'Assil', 'Mme Sahar', 'dimanche-aprem'),
('hifdh-preparatoire', 'KHALAF', 'Ayoub', 'Mme LABID Fadoua', 'dimanche-aprem'),
('hifdh-preparatoire', 'LABID', 'Soulaymane rhali', 'Mme LABID Fadoua', 'dimanche-aprem'),
('hifdh-preparatoire', 'LOUBIAS', 'Inaya', 'Mme Sahar', 'dimanche-aprem'),
('hifdh-preparatoire', 'ZIANI', 'Selma', 'Mme TRAORE Fatiha', 'dimanche-aprem');

-- Niveau : فئة التجويد بالحفظ : المستوى الثالث (3 élèves)
INSERT INTO eleves (niveau, nom, prenom, professeur, creneau) VALUES
('hifdh-niveau3', 'BENRAHO', 'Younes', 'Mme BOUZAMBOU Mariam', 'dimanche-aprem'),
('hifdh-niveau3', 'EL OUARDI', 'Barae', 'Mme DAIRAK Achouak', 'dimanche-aprem'),
('hifdh-niveau3', 'SAIDI', 'Adam', 'Mme AZZAKHNINI Jamila', 'dimanche-aprem');

-- ========================================
-- VÉRIFICATION
-- ========================================
-- SELECT creneau, COUNT(*) as nb_eleves
-- FROM eleves
-- WHERE creneau = 'dimanche-aprem'
-- GROUP BY creneau;
--
-- Résultat attendu : 20 élèves

-- ========================================
-- NOTES
-- ========================================
-- 2 élèves ont un nom de famille inconnu (marqué "?")
-- Vous pouvez les mettre à jour plus tard via :
-- UPDATE eleves SET nom = 'NOM_REEL' WHERE nom = '?' AND prenom = 'Ahmad' AND creneau = 'dimanche-aprem';
-- UPDATE eleves SET nom = 'NOM_REEL' WHERE nom = '?' AND prenom = 'Ibrahim' AND creneau = 'dimanche-aprem';
