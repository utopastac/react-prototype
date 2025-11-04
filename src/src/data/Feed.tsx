export interface FeedItem {
  id: string;
  author: {
    name: string;
    avatar: string;
    headline?: string;
  };
  content: string;
  mediaUrl?: string;
  createdAt: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export const Feed: FeedItem[] = [
  {
    id: "1",
    author: {
      name: "Peter Wright",
      avatar: "https://i.pravatar.cc/200?id=1",
      headline: "Product Designer at Example Co."
    },
    content: "Grabbed dinner with the team after a long sprint. 🍽️",
    createdAt: "2025-09-28T18:00:00Z",
    stats: {
      likes: 24,
      comments: 3,
      shares: 0
    }
  },
  {
    id: "2",
    author: {
      name: "Spotify",
      avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/200px-Spotify_logo_without_text.svg.png",
      headline: "Company • Music and Podcasts"
    },
    content: "Discover fresh tracks every week. What are you listening to today?",
    mediaUrl: undefined,
    createdAt: "2025-09-28T20:00:00Z",
    stats: {
      likes: 102,
      comments: 12,
      shares: 4
    }
  }
];

export type { FeedItem as FeedPost };


