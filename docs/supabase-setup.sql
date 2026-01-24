-- ========================================
-- CRÉATION DE LA TABLE notes
-- ========================================

CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niveau TEXT NOT NULL,
  eleve TEXT NOT NULL,
  jury TEXT NOT NULL,
  total NUMERIC NOT NULL,
  moyenne NUMERIC NOT NULL,
  scores JSONB NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_notes_niveau ON notes(niveau);
CREATE INDEX IF NOT EXISTS idx_notes_eleve ON notes(eleve);
CREATE INDEX IF NOT EXISTS idx_notes_jury ON notes(jury);
CREATE INDEX IF NOT EXISTS idx_notes_recorded_at ON notes(recorded_at DESC);

-- ========================================
-- INSERTION DES ÉLÈVES (optionnel)
-- ========================================
-- Note: Cette section est optionnelle car les élèves sont déjà codés
-- dans l'application Next.js (data/niveaux.ts).
-- Vous pouvez créer une table séparée si vous souhaitez gérer
-- les élèves dynamiquement depuis Supabase.

CREATE TABLE IF NOT EXISTS eleves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niveau TEXT NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  professeur TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_eleves_niveau ON eleves(niveau);

-- Insertion des élèves - Tajwid par récitation Niveau 1
INSERT INTO eleves (niveau, nom, prenom, professeur) VALUES
('tilawa-niveau1', 'EL KELLALI', 'Ines', 'Mme ZEKRI Laila'),
('tilawa-niveau1', 'HASSAINE', 'Owayss', 'Mme EL AMROUCHI Chahida');

-- Insertion des élèves - Tajwid par mémorisation Niveau 1
INSERT INTO eleves (niveau, nom, prenom, professeur) VALUES
('hifdh-niveau1', 'OUHANNOU', 'Kamil', 'Mme TILIOUINE Monia'),
('hifdh-niveau1', 'SOLDI', 'Camilla', 'Mme ZEKRI Laila');

-- Insertion des élèves - Tajwid par mémorisation Niveau 2
INSERT INTO eleves (niveau, nom, prenom, professeur) VALUES
('hifdh-niveau2', 'ALIOUANE', 'Celia', 'Mme ZEKRI Laila'),
('hifdh-niveau2', 'AMMOUFAGOULI', 'Kawtar', 'Mme ZEKRI Laila'),
('hifdh-niveau2', 'BRITAL', 'Lina', 'Mme ZEKRI Laila'),
('hifdh-niveau2', 'ELABABES', 'Inès', 'Mme DAIRAK Achouak'),
('hifdh-niveau2', 'SAMB', 'Rama lissah', 'Mme ZEKRI Laila'),
('hifdh-niveau2', 'TILIOUINE', 'Farah', 'Mme DAIRAK Achouak'),
('hifdh-niveau2', 'TIOUAJNI', 'Kenza', 'Mme ZEKRI Laila');

-- Insertion des élèves - Tajwid par mémorisation Niveau préparatoire
INSERT INTO eleves (niveau, nom, prenom, professeur) VALUES
('hifdh-preparatoire', 'ABDELMOUMENE', 'Sami', 'Mme LABID Fadoua'),
('hifdh-preparatoire', 'AMRABD', 'Chaymae', 'Mme ATTOUIFALI'),
('hifdh-preparatoire', 'ATTARBAOUI', 'Mohamed', 'Mme ATTOUIFALI'),
('hifdh-preparatoire', 'AZZAKHNINI', 'Zayd', 'Mme ATTOUIFALI'),
('hifdh-preparatoire', 'BOUSSAID', 'Aness ouassim', 'Mme LABID Fadoua'),
('hifdh-preparatoire', 'CHOUAF', 'Adam', 'Mme LABID Fadoua'),
('hifdh-preparatoire', 'JELLALI', 'Malek', 'Mme ATTOUIFALI'),
('hifdh-preparatoire', 'OUHANNOU', 'Kamil', 'Mme TILIOUINE Monia'),
('hifdh-preparatoire', 'SERRANO', 'Ishaq', 'Mme ATTOUIFALI'),
('hifdh-preparatoire', 'TAOUSSI', 'Ines', 'Mme TILIOUINE Monia'),
('hifdh-preparatoire', 'TILIOUINE', 'Ilyes', 'Mme TILIOUINE Monia'),
('hifdh-preparatoire', 'ZEGGAG', 'Nour', 'Mme ATTOUIFALI');

-- Insertion des élèves - Tajwid par mémorisation Niveau 3
INSERT INTO eleves (niveau, nom, prenom, professeur) VALUES
('hifdh-niveau3', 'ABADIA', 'Anis', 'Mme BOUZAMBOU Mariam'),
('hifdh-niveau3', 'ATTARLNOUI', 'Ilyes', 'Mme BOUZAMBOU Mariam'),
('hifdh-niveau3', 'BENREHHO', 'Youmi', 'Mme BOUZAMBOU Mariam'),
('hifdh-niveau3', 'DORGHOL', 'Nadir', 'Mr JAMMEL Youssef'),
('hifdh-niveau3', 'TAITI BRITAL', 'Mohamed', 'Mme BOUZAMBOU Mariam'),
('hifdh-niveau3', 'TAITI BRITAL', 'Nizar', 'Mme BOUZAMBOU Mariam'),
('hifdh-niveau3', 'TILIOUINE', 'Aymen', 'Mr MESLI Abderrahmene');

-- Insertion des élèves - Tajwid par mémorisation Niveau 4
INSERT INTO eleves (niveau, nom, prenom, professeur) VALUES
('hifdh-niveau4', 'DORGHOL', 'Youcef', 'Mr JAMMEL Youssef');

-- ========================================
-- POLITIQUE DE SÉCURITÉ (Row Level Security - RLS)
-- ========================================
-- Pour un usage simple, vous pouvez désactiver RLS ou créer des politiques

-- Option 1: Désactiver RLS (pour développement/test uniquement)
-- ALTER TABLE notes DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE eleves DISABLE ROW LEVEL SECURITY;

-- Option 2: Activer RLS avec politique publique (lecture/écriture pour tous)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eleves ENABLE ROW LEVEL SECURITY;

-- Politique: tout le monde peut lire
CREATE POLICY "Allow public read access on notes"
  ON notes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Politique: tout le monde peut insérer
CREATE POLICY "Allow public insert access on notes"
  ON notes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Politique: tout le monde peut lire les élèves
CREATE POLICY "Allow public read access on eleves"
  ON eleves FOR SELECT
  TO anon, authenticated
  USING (true);

-- ========================================
-- REQUÊTES UTILES
-- ========================================

-- Lister toutes les notes par niveau
-- SELECT niveau, eleve, jury, moyenne, total, recorded_at
-- FROM notes
-- ORDER BY niveau, recorded_at DESC;

-- Voir la moyenne par niveau
-- SELECT niveau, ROUND(AVG(moyenne), 2) as moyenne_generale, COUNT(*) as nb_notes
-- FROM notes
-- GROUP BY niveau
-- ORDER BY niveau;

-- Voir toutes les notes d'un élève
-- SELECT * FROM notes WHERE eleve = 'EL KELLALI Ines' ORDER BY recorded_at DESC;
