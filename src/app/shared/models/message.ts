export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  isDelivered: boolean;
  isRead: boolean;
  isEdited: boolean;
}
