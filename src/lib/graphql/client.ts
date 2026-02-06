import { GraphQLClient } from "graphql-request";

const getEndpoint = () => {
  if (typeof window === "undefined") {
    if (process.env.POOL_API_URL) {
      return process.env.POOL_API_URL;
    }
    throw new Error("POOL_API_URL not configured on server");
  }

  return `${window.location.origin}/api/graphql`;
};

export const graphClient = new GraphQLClient(getEndpoint());
