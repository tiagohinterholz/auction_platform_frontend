export interface CreateAuctionPayload {
  title: string;
  description: string;
  startingPrice: number;
  minimumIncrement: number;
  startTime: string;
  endTime: string;
  images: string[];
}
