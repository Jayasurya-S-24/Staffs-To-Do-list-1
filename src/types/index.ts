export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'important' | 'normal';
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  department?: string;
}