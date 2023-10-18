export interface Duty {
  id: number;
  createdAt: string;
  modifiedAt: string;
  title: string;
  workers: Worker[];
}

export interface Worker {
  id: number;
  name: string;
  surname: string;
  pictureUrl?: string;
  dutyId: number;
  duty: string;
}

export interface WorkerParams {
  orderBy: string;
  searchTerm?: string;
  duties: string[];
  pageNumber: number;
  pageSize: number;
}
