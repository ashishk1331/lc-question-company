export type Question = {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  title: string;
  frequency: number;
  acceptance_rate: number;
  link: string;
  id: string;
};
