export type Status = "Diproses" | "Disetujui" | "Ditolak";

export interface Submission {
  id: number;
  imageUrl: string;
  title: string;
  group: string;
  date: string;
  status: Status;
}
