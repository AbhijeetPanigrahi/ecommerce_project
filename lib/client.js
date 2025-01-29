import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url"; // Correct utility for images

// Sanity client configuration
export const client = createClient({
  projectId: "equp2jk4", // Replace with your actual project ID
  dataset: "production", // Replace with your dataset name
  apiVersion: "2025-01-23", // Use the desired API version
  useCdn: true, // Enable CDN for faster reads in production
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN, // Optional, for authenticated requests
});

// Utility function for building image URLs
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source);
