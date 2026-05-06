import { fetcher } from "../api";

export type CreateComplaintPayload = {
  reservationId: number;
  reasonId: number;
  comments: string;
  complaintAttachments: string[];
};

export const createComplaint = (payload: CreateComplaintPayload) => {
  return fetcher(`/complaints`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
