// Public API of the auction module: other modules and the app import from
// "@/modules/auction", never from its internal folders.

export { default as auctionRoutes } from "./presentation/router";
export { useAuctionStore } from "./presentation/stores/auction.store";
export * from "./domain";
