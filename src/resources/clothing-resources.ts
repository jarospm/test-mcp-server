/**
 * Resource definitions for clothing recommendations
 */

import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CONDITIONS, formatClothingAsMarkdown } from "./clothing.js";

/**
 * Resource definition structure matching the tools pattern
 */
interface ResourceDefinition {
  template: ResourceTemplate;
  metadata: {
    title: string;
    description: string;
  };
  handler: (uri: URL, variables: Record<string, unknown>) => Promise<{
    contents: Array<{
      uri: string;
      mimeType: string;
      text: string;
    }>;
  }>;
}

/**
 * Clothing recommendations resource exports
 */
export const clothingResources: Record<string, ResourceDefinition> = {
  "clothing-recommendations": {
    template: new ResourceTemplate("weather://clothing/{condition}", {
      list: undefined,
      complete: {
        condition: (value) => {
          return CONDITIONS.filter((cond) =>
            cond.toLowerCase().startsWith(value.toLowerCase())
          );
        },
      },
    }),
    metadata: {
      title: "Weather-Based Clothing Recommendations",
      description:
        "Clothing and accessory recommendations for different weather conditions",
    },
    handler: async (uri, variables) => {
      const condition = variables.condition as string;

      if (!CONDITIONS.includes(condition)) {
        throw new Error(
          `Unknown weather condition: ${condition}. Available: ${CONDITIONS.join(", ")}`
        );
      }

      const content = formatClothingAsMarkdown(condition);
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: content,
          },
        ],
      };
    },
  },
};
