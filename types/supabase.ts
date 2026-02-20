export type NoteRow = {
  id: string;
  niveau: string;
  eleve: string;
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number>;
  recorded_at: string;
  publie: boolean;
  date_publication: string | null;
  phase: string | null;
};

export type NoteInsert = {
  niveau: string;
  eleve: string;
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number>;
  recorded_at?: string;
  phase?: string | null;
};

export type NoteUpdate = {
  niveau?: string;
  eleve?: string;
  jury?: string;
  total?: number;
  moyenne?: number;
  scores?: Record<string, number>;
  recorded_at?: string;
  publie?: boolean;
  date_publication?: string | null;
  phase?: string | null;
};

export type EleveRow = {
  id: string;
  niveau: string;
  nom: string;
  prenom: string;
  professeur: string | null;
  creneau: string;
  date_naissance: string | null;
  age: number | null;
  classe: string | null;
  note1: number | null;
  note2: number | null;
  moyenne_qualif: number | null;
  observation: string | null;
  qualification: string | null;
  competition: string | null;
  created_at: string;
};

export type EnseignantRow = {
  id: string;
  nom: string;
  ordre: number;
  login_username: string | null;
};

export type EnseignantInsert = {
  nom: string;
  ordre: number;
  login_username?: string | null;
};

export type ConfigRow = {
  key: string;
  value: string;
};

export type Database = {
  public: {
    Tables: {
      config: {
        Row: ConfigRow;
        Insert: ConfigRow;
        Update: Partial<ConfigRow>;
      };
      notes: {
        Row: NoteRow;
        Insert: NoteInsert;
        Update: NoteUpdate;
      };
      eleves: {
        Row: EleveRow;
        Insert: Omit<EleveRow, 'id' | 'created_at'>;
        Update: Partial<Omit<EleveRow, 'id' | 'created_at'>>;
      };
      enseignants: {
        Row: EnseignantRow;
        Insert: Omit<EnseignantRow, 'id'>;
        Update: Partial<Omit<EnseignantRow, 'id'>>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
