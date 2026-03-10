export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  tasks: {
    all: ["tasks"] as const,
    list: (collectionId?: string) => collectionId ? ["tasks", { collectionId }] : ["tasks"],
    detail: (id: string) => ["tasks", id] as const,
  },
  collections: {
    all: ["collections"] as const,
    detail: (id: string) => ["collections", id] as const,
  },
  resources: {
    all: ["resources"] as const,
    list: (collectionId: string) => ["resources", { collectionId }] as const,
    detail: (id: string) => ["resources", id] as const,
  },
  leetcode: {
    all: ["leetcode"] as const,
    due: ["leetcode", "due"] as const,
    queue: ["leetcode", "queue"] as const,
  },
};
