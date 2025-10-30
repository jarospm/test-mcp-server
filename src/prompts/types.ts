/**
 * Type definitions and Zod schemas for prompts
 */

import { completable } from "@modelcontextprotocol/sdk/server/completable.js";
import { z } from "zod";
import { CONDITIONS } from "../resources/clothing.js";

/**
 * Zod schema for what-to-wear prompt arguments
 */
export const WhatToWearArgsSchema = {
  latitude: z.string().describe("Latitude coordinate (-90 to 90)"),
  longitude: z.string().describe("Longitude coordinate (-180 to 180)"),
  condition: completable(z.string(), (value) => {
    return CONDITIONS.filter((cond) =>
      cond.toLowerCase().startsWith(value.toLowerCase())
    ) as any;
  }).describe("Weather condition type: hot, cold, mild, rainy, snowy, or windy"),
};

/**
 * Type for what-to-wear prompt arguments (inferred from schema)
 */
export type WhatToWearArgs = {
  latitude: string;
  longitude: string;
  condition: string;
};

/**
 * Prompt definition structure matching the tools/resources pattern
 * Used for exporting prompts from feature modules
 */
export interface PromptDefinition {
  description: string;
  argsSchema: Record<string, z.ZodTypeAny>;
  handler: (args: any, extra?: any) => Promise<any>;
}
