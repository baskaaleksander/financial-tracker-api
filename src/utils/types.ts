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
