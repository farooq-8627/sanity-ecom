import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Check if the Sanity API token is available
if (!process.env.SANITY_API_TOKEN) {
  console.warn("SANITY_API_TOKEN is not set in environment variables. Write operations will fail.");
}

export const backendClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always set to false for write operations
  //  revalidation
  token: process.env.SANITY_API_TOKEN,
});

// Helper function to check if token is available before operations
export const checkToken = () => {
  if (!process.env.SANITY_API_TOKEN) {
    throw new Error("SANITY_API_TOKEN is not set in environment variables");
  }
};
