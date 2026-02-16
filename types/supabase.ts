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
};

export type NoteInsert = {
  niveau: string;
  eleve: string;
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number>;
  recorded_at?: string;
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

export type Database = {
  public: {
    Tables: {
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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
