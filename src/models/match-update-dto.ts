export interface MatchUpdateDto {
  id: string;
  status: string;
  statusChangetAt: Date;
  statusChangedBy: string;
  quarters: {
    q1: {
      guest: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
      home: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
    };
    q2: {
      guest: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
      home: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
    };
    q3: {
      guest: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
      home: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
    };
    q4: {
      guest: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
      home: {
        pos1: string;
        pos2: string;
        pos3: string;
        pos4?: string;
        pos5?: string;
        pos6?: string;
        pos7?: string;
        pos8?: string;
        legs: {
          m1: number | null;
          m2: number | null;
          m3: number | null;
          m4: number | null;
        };
        score: number;
      };
    };
  };
  overtime?: {
    guest: {
      pos1?: string | null;
      pos2?: string | null;
      pos3?: string | null;
      pos4?: string | null;
      pos5?: string | null;
      pos6?: string | null;
      legs: {
        m1: number;
        m2: number;
        m3: number;
      };
      score: number;
    };
    home: {
      pos1?: string | null;
      pos2?: string | null;
      pos3?: string | null;
      pos4?: string | null;
      pos5?: string | null;
      pos6?: string | null;
      legs: {
        m1: number;
        m2: number;
        m3: number;
      };
      score: number;
    };
  };
}
