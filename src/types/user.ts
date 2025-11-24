export interface User {
  id: string;
  name: string;
  role: 'teacher' | 'parent' | 'admin';
  avatar?: string;
  phone?: string;
  email?: string;
}
