export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  link?: string;
  date: string;
}
