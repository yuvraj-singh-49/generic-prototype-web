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
      (object: THREE.Group | THREE.BufferGeometry) => {
        const parts: Part[] = [];
        const partMap: Record<string, number> = {}; // Object to store part counts

        if (fileType === "stl") {
          const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
          const mesh = new THREE.Mesh(object as THREE.BufferGeometry, material);
          const partName = mesh.uuid;
          partMap[partName] = partMap[partName] ? partMap[partName] + 1 : 1;

          parts.push({
            name: partName,
            geometry: object as THREE.BufferGeometry,
            material: material,
            mesh: mesh,
          });
        } else {
          (object as THREE.Group).traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const partName = child.name || `Part ${parts.length + 1}`;
              partMap[partName] = partMap[partName] ? partMap[partName] + 1 : 1;

              parts.push({
                name: partName,
                geometry: (child as THREE.Mesh).geometry,
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

export { getFileType, extractParts };
