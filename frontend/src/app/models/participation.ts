export interface Participation {
  id: number;
  email: string;
  seats: number;
  totalPrice: number;
  createdAt: string;
  userId: number;
  event: {
    id: number;
    titre: string;
    date: string;
    lieu: string;
    prix: number;
  };
}

