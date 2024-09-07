// @ts-nocheck

import * as THREE from "three";

import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

/**
 * Extract the file type (extension) from a file name.
 * @param {string} fileName - The name of the file.
 * @returns {string} - The file type (extension) in lowercase.
 */

function getFileType(fileName: string): string {
  const extension = fileName.split(".").pop();
  return extension ? extension.toLowerCase() : "";
}

/**
 * Load and extract parts from a 3D model file.
 * @param {string} url - The URL to the model file.
 * @param {string} fileType - The type of the model file ('stl', 'obj', 'fbx').
 * @returns {Promise<Array>} - A promise that resolves to an array of part objects with names and geometry.
 */

// Function to extract parts from a model
async function extractParts(
  url: string,
  fileType: string
): Promise<{ parts: Part[]; partMap: Record<string, number> }> {
  let loader: any;

  switch (fileType) {
    case "stl":
      loader = new STLLoader();
      break;
    case "obj":
      loader = new OBJLoader();
      break;
    case "fbx":
      loader = new FBXLoader();
      break;
    default:
      throw new Error("Unsupported file type");
  }

  return new Promise((resolve, reject) => {
    loader.load(
      url,
      (geometry: THREE.Group | THREE.BufferGeometry) => {
        const parts: Part[] = [];
        const partMap: Record<string, number> = {}; // Object to store part counts

        if (fileType === "stl") {
          const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          const mesh = new THREE.Mesh(
            geometry as THREE.BufferGeometry,
            material
          );
          const cleanedGeometry = cleanAndValidateGeometry(geometry);
          const partName = url.split("/").pop()?.split(".")?.[0] ?? mesh?.uuid;
          partMap[partName] = partMap[partName] ? partMap[partName] + 1 : 1;

          parts.push({
            name: partName,
            geometry: cleanedGeometry as THREE.BufferGeometry,
            material: material,
            mesh: mesh,
          });
        } else {
          (geometry as THREE.Group).traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const cleanedGeometry = cleanAndValidateGeometry(
                (child as THREE.Mesh).geometry
              );

              const partName = child.name || `Part ${parts.length + 1}`;
              partMap[partName] = partMap[partName] ? partMap[partName] + 1 : 1;

              parts.push({
                name: partName,
                geometry: cleanedGeometry,
                material: (child as THREE.Mesh).material.clone(),
                mesh: child as THREE.Mesh,
              });
            }
          });
        }

        resolve({ parts, partMap });
      },
      undefined,
      (error: ErrorEvent) => reject(error)
    );
  });
}

// Function to clean and validate geometry
const cleanAndValidateGeometry = (geometry: THREE.BufferGeometry) => {
  if (geometry.attributes.position === undefined) {
    console.error("STL file has no position attribute.");
    return geometry;
  }

  // Check for NaN values and replace them with zeros
  const positions = geometry.attributes.position.array;
  for (let i = 0; i < positions.length; i++) {
    if (isNaN(positions[i])) {
      console.warn(`NaN detected at index ${i}, replacing with 0.`);
      positions[i] = 0;
    }
  }

  geometry.attributes.position.needsUpdate = true;

  // Compute the bounding box and sphere after cleaning
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
};

export { getFileType, extractParts, cleanAndValidateGeometry };
