export type CategoryBreakdown = {
  income: { [category: string]: number };
  expense: { [category: string]: number };
};

export type DailyBreakdown = {
  [date: string]: {
    income: number;
    expense: number;
    netBalance: number;
  };
};

export interface UserPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
  cookies: {
    token?: string;
  };
}
