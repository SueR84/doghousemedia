import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    client: z.string().default(""),
    service: z.string().default(""),
    shortDescription: z.string().default(""),
    websiteLink: z.string().default(""),
    projectVideo: z.string().default(""),
    projectImage: z.string().default(""),
    projectGallery: z.array(z.string()).default([]),
    projectType: z.array(z.string()).default([]),
    craft: z.enum(["web", "video", "both"]).default("web"),
    status: z.enum(["publish", "draft"]).default("publish"),
  }),
});

export const collections = { projects };
