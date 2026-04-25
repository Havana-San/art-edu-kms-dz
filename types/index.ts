export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  teacher_id: string;
  thumbnail_url?: string;
  is_published: boolean;
  created_at: string;
  teacher?: User;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  video_url?: string;
  content?: string;
  order: number;
  created_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  question: string;
  options: string[];
  correct_answer: string;
}