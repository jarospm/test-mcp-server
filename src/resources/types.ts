/**
 * Type definitions for resource registration and data models
 */

import {
  ResourceTemplate,
  ReadResourceTemplateCallback,
} from "@modelcontextprotocol/sdk/server/mcp.js";

/**
 * Resource metadata structure (SDK-compatible)
 * Must have index signature to match SDK's ResourceMetadata type
 */
export interface ResourceMetadata {
  title?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Resource definition structure matching the tools pattern
 * Used for exporting resources from feature modules
 */
export interface ResourceDefinition {
  template: ResourceTemplate;
  metadata: ResourceMetadata;
  handler: ReadResourceTemplateCallback;
}

// ============================================================================
// Clothing Resource Data Models
// ============================================================================

/**
 * Clothing recommendation structure for a specific weather condition
 */
export interface ClothingRecommendation {
  condition: string;
  temperature: string;
  layers: string[];
  accessories: string[];
  footwear: string[];
  tips: string[];
}

/**
 * Map of weather conditions to clothing recommendations
 */
export interface WeatherConditions {
  [condition: string]: ClothingRecommendation;
}
