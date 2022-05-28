import { InMemoryCache, makeVar } from "@apollo/client";

export const postItemsVar = makeVar<{ id: string; title: string }[]>([]);

export const counterVar = makeVar<{ name: string; value: number }>({
  name: "",
  value: 0,
});

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        counter: {
          read() {
            return counterVar();
          },
        },
        postItems: {
          read() {
            return postItemsVar();
          },
        },
      },
    },
  },
});
