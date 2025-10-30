/**
 * Clothing recommendation data for different weather conditions
 */

import { WeatherConditions } from "./types.js";

export const CLOTHING_DATA: WeatherConditions = {
  hot: {
    condition: "Hot Weather",
    temperature: "Above 25°C (77°F)",
    layers: [
      "Light, breathable t-shirt or tank top",
      "Shorts or lightweight pants",
      "Loose-fitting, light-colored clothing to reflect heat",
    ],
    accessories: [
      "Sunglasses with UV protection",
      "Wide-brimmed hat or cap",
      "Sunscreen (SPF 30+)",
      "Light scarf for sun protection",
    ],
    footwear: [
      "Sandals or open-toe shoes",
      "Breathable sneakers",
      "Avoid heavy boots",
    ],
    tips: [
      "Choose natural fabrics like cotton and linen",
      "Light colors reflect sunlight and keep you cooler",
      "Stay hydrated and seek shade during peak sun hours",
      "Consider UV-protective clothing for extended outdoor time",
    ],
  },
  cold: {
    condition: "Cold Weather",
    temperature: "Below 5°C (41°F)",
    layers: [
      "Thermal base layer (long underwear)",
      "Insulating mid-layer (fleece or wool sweater)",
      "Warm insulated jacket or winter coat",
      "Long pants or insulated trousers",
    ],
    accessories: [
      "Warm hat or beanie covering ears",
      "Insulated gloves or mittens",
      "Thick scarf or neck warmer",
      "Thermal socks",
    ],
    footwear: [
      "Insulated winter boots",
      "Waterproof boots with good traction",
      "Warm, thick socks (wool or synthetic blend)",
    ],
    tips: [
      "Layer clothing for adjustable warmth",
      "Cover extremities - hands, feet, ears, and nose lose heat quickly",
      "Choose windproof outer layers to prevent heat loss",
      "Avoid cotton base layers; use synthetic or wool instead",
      "Watch for signs of frostbite in extreme cold",
    ],
  },
  mild: {
    condition: "Mild Weather",
    temperature: "15-25°C (59-77°F)",
    layers: [
      "Light long-sleeve shirt or t-shirt",
      "Light jacket, cardigan, or hoodie",
      "Long pants or jeans",
      "Layer options for temperature changes",
    ],
    accessories: [
      "Light scarf (optional)",
      "Sunglasses",
      "Small umbrella for unexpected rain",
    ],
    footwear: [
      "Comfortable sneakers",
      "Casual shoes",
      "Light boots",
    ],
    tips: [
      "Perfect weather for layering",
      "Bring an extra layer for evening cooling",
      "Most versatile clothing works well",
      "Consider the time of day - mornings and evenings may be cooler",
    ],
  },
  rainy: {
    condition: "Rainy Weather",
    temperature: "Variable",
    layers: [
      "Base layer appropriate for temperature",
      "Waterproof or water-resistant jacket with hood",
      "Quick-dry pants or jeans",
      "Consider waterproof pants for heavy rain",
    ],
    accessories: [
      "Umbrella (compact or full-size)",
      "Waterproof bag or backpack cover",
      "Rain hat or waterproof hood",
    ],
    footwear: [
      "Waterproof boots or rain boots",
      "Water-resistant shoes with good grip",
      "Avoid suede or canvas shoes",
      "Waterproof socks for extra protection",
    ],
    tips: [
      "Check rain intensity - light drizzle vs. heavy downpour requires different gear",
      "Keep important items in waterproof bags",
      "Avoid cotton clothing that stays wet and cold",
      "Choose shoes with good traction to prevent slipping",
      "Bright colors improve visibility in poor conditions",
    ],
  },
  snowy: {
    condition: "Snowy Weather",
    temperature: "Below 0°C (32°F)",
    layers: [
      "Moisture-wicking base layer",
      "Insulating mid-layer (down or synthetic)",
      "Waterproof, insulated winter jacket",
      "Waterproof snow pants or insulated trousers",
    ],
    accessories: [
      "Insulated waterproof gloves or mittens",
      "Warm hat or balaclava",
      "Neck gaiter or scarf",
      "Ski goggles or sunglasses (snow glare)",
      "Hand and toe warmers",
    ],
    footwear: [
      "Insulated waterproof snow boots",
      "Boots with deep treads for traction",
      "Gaiters to keep snow out",
      "Thick wool or synthetic socks",
    ],
    tips: [
      "Waterproofing is critical - wet clothing loses insulation",
      "Layer properly: base layer (moisture), mid layer (warmth), outer layer (protection)",
      "Protect your face and extremities from frostbite",
      "Choose boots rated for the temperature",
      "Bright colors help with visibility in snowstorms",
    ],
  },
  windy: {
    condition: "Windy Weather",
    temperature: "Variable",
    layers: [
      "Base layer appropriate for temperature",
      "Windproof jacket or windbreaker",
      "Fitted clothing to reduce wind resistance",
    ],
    accessories: [
      "Secure hat or skip it (avoid loose hats)",
      "Windproof gloves",
      "Wrap-around sunglasses or goggles",
      "Secure scarf",
    ],
    footwear: [
      "Sturdy shoes with good ankle support",
      "Avoid loose footwear",
    ],
    tips: [
      "Wind chill can make it feel much colder than actual temperature",
      "Secure all loose clothing and accessories",
      "Windproof outer layer is more important than thickness",
      "Protect eyes from blowing dust and debris",
      "Consider wind direction when planning outdoor activities",
    ],
  },
};

export const CONDITIONS = Object.keys(CLOTHING_DATA);

export function formatClothingAsMarkdown(condition: string): string {
  const clothing = CLOTHING_DATA[condition];
  if (!clothing) {
    return `# No recommendations found for "${condition}"\n\nAvailable conditions: ${CONDITIONS.join(", ")}`;
  }

  let markdown = `# What to Wear: ${clothing.condition}\n\n`;
  markdown += `**Temperature Range:** ${clothing.temperature}\n\n`;

  markdown += `## 🧥 Clothing Layers\n\n`;
  for (const layer of clothing.layers) {
    markdown += `- ${layer}\n`;
  }

  markdown += `\n## 🎒 Accessories\n\n`;
  for (const accessory of clothing.accessories) {
    markdown += `- ${accessory}\n`;
  }

  markdown += `\n## 👟 Footwear\n\n`;
  for (const shoe of clothing.footwear) {
    markdown += `- ${shoe}\n`;
  }

  markdown += `\n## 💡 Tips\n\n`;
  for (const tip of clothing.tips) {
    markdown += `- ${tip}\n`;
  }

  return markdown;
}
