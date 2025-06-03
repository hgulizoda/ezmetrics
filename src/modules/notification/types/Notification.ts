interface Language {
  uz: string;
  ru: string;
}

export interface INotificationRes {
  _id: string;
  title: Language;
  body: Language;
  image: Language;
  type: string;
  date: string;
  updated_at: string;
}

export interface INotification {
  id: string;
  title: Language;
  body: Language;
  image: Language;
  sendedDate: string;
  updatedDate: string;
}
