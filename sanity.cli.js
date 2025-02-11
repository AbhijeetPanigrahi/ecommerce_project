/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from "sanity/cli";

// import dotenv from "dotenv";

// dotenv.config(); // Ensures env variables are loaded

const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET;
// const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
// const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

console.log("Sanity Project ID:", projectId);
console.log("Sanity Dataset:", dataset);

export default defineCliConfig({ api: { projectId, dataset } });
