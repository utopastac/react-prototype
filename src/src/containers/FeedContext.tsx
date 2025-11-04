import React, { createContext, Dispatch, useContext, useReducer, ReactNode } from 'react';
import { Feed, FeedItem } from "src/data/Feed";

type FeedAction = 
  | { type: typeof FEED_ADD; post: FeedItem }
  | { type: typeof FEED_REMOVE; index: number };

const FeedContext = createContext<FeedItem[] | null>(null);
const FeedDispatchContext = createContext<Dispatch<FeedAction> | null>(null);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [feed, dispatch] = useReducer<React.Reducer<FeedItem[], FeedAction>>(
    FeedReducer,
    [...Feed]
  );

  return (
    <FeedContext.Provider value={feed}>
      <FeedDispatchContext.Provider value={dispatch}>
        {children}
      </FeedDispatchContext.Provider>
    </FeedContext.Provider>
  );
}

export function useFeed() {
  const context = useContext(FeedContext);
  if (context === null) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
}

export function useFeedDispatch() {
  const context = useContext(FeedDispatchContext);
  if (context === null) {
    throw new Error('useFeedDispatch must be used within a FeedProvider');
  }
  return context;
}

function FeedReducer(feed: FeedItem[], action: FeedAction): FeedItem[] {
  switch (action.type) {
    case FEED_ADD: {
      return [...feed, action.post];
    }
    case FEED_REMOVE: {
      const newFeed = [...feed];
      newFeed.splice(action.index, 1);
      return newFeed;
    }
    default: {
      throw new Error(`Unknown action: ${(action as any).type}`);
    }
  }
}

export const FEED_REMOVE = "FEED_REMOVE" as const;
export const FEED_ADD = "FEED_ADD" as const;

export type { FeedItem };


