export type NoteRow = {
  id: string;
  niveau: string;
  eleve: string;
  jury: string;
  total: number;
  moyenne: number;
  scores: Record<string, number>;
  recorded_at: string;
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

export type EleveRow = {
  id: string;
  niveau: string;
  nom: string;
  prenom: string;
  professeur: string | null;
  creneau: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: NoteRow;
        Insert: NoteInsert;
        Update: Partial<NoteInsert>;
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
