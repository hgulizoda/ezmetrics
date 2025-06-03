export interface ITruckRes {
  name: string;
  _id: string;
  status: string;
  estimated_arrival_date: string;
  created_at: string;
  container_number?: string;
}

export interface ITruck {
  truckName: string;
  id: string;
  status: string;
  createdAt: string;
  estimatedArrivalDate: string;
  containerNumber: string;
}
