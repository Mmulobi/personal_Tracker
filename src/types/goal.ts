export interface Goal {
  id: string;
  title: string;
  description: string;
  deadline?: Date;
  progress: number;
  milestones: string[];
}