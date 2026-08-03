/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CropSample {
  id: string;
  name: string;
  description: string;
  cropName: string;
  base64: string; // inline base64 string (actual valid PNG data of a tiny visual leaf or placeholder)
  mimeType: string;
  illustrationClass: string; // for custom beautiful leaf render prior to scan
}

export const cropSamples: CropSample[] = [
  {
    id: "potato-late-blight",
    name: "Potato Leaf with Mildew Symptoms",
    description: "Has circular water-soaked dark gray spots on leaf tip, white fuzz under humid weather",
    cropName: "Potato",
    mimeType: "image/png",
    // Base64 encoding of a tiny green pixel representing a leaf to ensure valid image data is sent to Gemini
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAD0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    illustrationClass: "from-amber-700 via-emerald-800 to-emerald-950"
  },
  {
    id: "rice-blast",
    name: "Rice Stalk showing Yellowish Blight",
    description: "Spindle-shaped lesions with grayish centers and brown borders along long leaf blades",
    cropName: "Rice",
    mimeType: "image/png",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAD0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    illustrationClass: "from-yellow-600 via-emerald-700 to-emerald-900"
  },
  {
    id: "mango-powdery-mildew",
    name: "Mango Blossom Infestation",
    description: "White chalky powder covering blossom buds and panicles, cause young fruits to drop early",
    cropName: "Mango",
    mimeType: "image/png",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAD0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    illustrationClass: "from-gray-300 via-emerald-700 to-emerald-950"
  },
  {
    id: "jute-stem-rot",
    name: "Jute Fiber Stem Necrosis",
    description: "Grayish brown patches turning black and decaying the structural stalk fiber",
    cropName: "Jute",
    mimeType: "image/png",
    base64: "iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAD0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    illustrationClass: "from-neutral-900 via-emerald-800 to-emerald-950"
  }
];
