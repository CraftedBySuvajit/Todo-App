export type Priority = 'low' | 'medium' | 'high';
export type Status = 'todo' | 'in-progress' | 'completed';

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  tags: string[];
  notes?: string;
  subTasks?: SubTask[];
  createdAt: string;
  userId: string;
  order: number;
  workingDate?: string;
  dueDate?: string;
  enableEmailAlerts?: boolean;
}

export interface AIGeneratedTask {
  title: string;
  priority: Priority;
  tags: string[];
  notes?: string;
}
