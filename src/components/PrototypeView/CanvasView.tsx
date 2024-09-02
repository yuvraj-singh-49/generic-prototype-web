// @ts-nocheck

import React, { useState, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
  Divider,
} from "@mui/material";
import Toast from "../Toast";
import { extractParts, getFileType } from "../../common/methods";
import axiosApi from "../../app/config";

// Define types for part and model
interface Part {
  name: string;
  geometry: THREE.BufferGeometry | null;
  material: THREE.Material;
  mesh: THREE.Mesh;
}

interface Model {
  fileName: string;
  parts: Part[];
}

interface CanvasViewProps {
  fileUrlList: any;
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

// Component to adjust the camera based on the model's size
const AutoFitCamera = ({ models }) => {
  const { camera, controls } = useThree();

  useEffect(() => {
    if (models.length === 0) return;

    const boundingBox = new THREE.Box3();
    models.forEach((model) =>
      model.parts.forEach((part) => {
        if (part.geometry) boundingBox.expandByObject(part.mesh);
      })
    );

    const center = boundingBox.getCenter(new THREE.Vector3());
    const size = boundingBox.getSize(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));

    cameraZ *= 1.5; // Add some padding
    camera.position.set(center.x, center.y, cameraZ);

    if (controls) {
      controls.target.set(center.x, center.y, center.z);
      controls.update();
    }

    camera.lookAt(center);
  }, [models, camera, controls]);

  return null;
};

// Component to render a model with its parts
const Model: React.FC<{ model: Model; selectedPartName: string | null }> = ({
  model,
  selectedPartName,
}) => {
  return (
    <group>
      {model.parts.map((part, index) => (
        <mesh
          key={index}
          geometry={part.geometry}
          material={
            part.name === selectedPartName
              ? new THREE.MeshStandardMaterial({ color: 0xff0000 }) // Highlight selected part
              : part.material // Use original material for non-selected parts
          }
        />
      ))}
    </group>
  );
};

const CanvasView: React.FC<CanvasViewProps> = ({ fileUrlList }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [bom, setBom] = useState<Record<string, number>>({});
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  useEffect(() => {
    async function loadModels() {
      const loadedModels: Model[] = [];
      let completeBom: Record<string, number> = {};

      for (const fileName of fileUrlList) {
        const fileType = getFileType(fileName);

        try {
          const { parts, partMap } = await extractParts(fileName, fileType);
          loadedModels.push({ fileName, parts });

          // Merge partMap into completeBom
          for (const [name, quantity] of Object.entries(partMap)) {
            completeBom[name] = completeBom[name]
              ? completeBom[name] + quantity
              : quantity;
          }
        } catch (error) {
          console.error(`Error loading model ${fileName}:`, error);
        }
      }

      setModels(loadedModels);
      setBom(completeBom);
    }

    if (!!fileUrlList?.length) {
      loadModels();
    }
  }, [fileUrlList]);

  const handleRenderingSave = async () => {
    const data = JSON.stringify({
      name: "Render No. " + parseInt(Math.random() * 10000),
      bom: bom,
      fileUrlList: fileUrlList,
      createdOn: new Date(),
    });

    const response = await axiosApi().post(`/api/post`, data);

    if (response?.status === 200) {
      setToastOpen(true);
    } else {
      console.error("Something went wrong!!!");
    }
  };

  const handleClose = () => {
    setToastOpen(false);
  };

  return (
    <Box display="flex" height="90vh">
      <Box
        width="20%"
        bgcolor="#f5f5f5" // Softer background color for a modern look
        p={2}
        overflow="auto"
        sx={{
          borderRadius: 2, // Rounded corners for a modern look
          boxShadow: 3, // Subtle shadow for depth
        }}
      >
        <Paper
          elevation={0}
          sx={{
            padding: 2,
            marginBottom: 2,
            borderRadius: 2,
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              color: "#fff",
              backgroundColor: "#fe3333",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#cc2a2a",
              },
            }}
            onClick={handleRenderingSave}
            fullWidth
            disabled={toastOpen}
          >
            Save this Rendering
          </Button>
        </Paper>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: 700, color: "#333" }}
        >
          Bill of Materials
        </Typography>
        <Divider sx={{ marginBottom: 2 }} />
        <List>
          {models.map((model, modelIndex) =>
            model.parts.map((part, partIndex) => (
              <ListItem
                button
                key={`${modelIndex}-${partIndex}`}
                selected={part.name === selectedPart}
                onClick={() => setSelectedPart(part.name)}
                sx={{
                  borderRadius: 1,
                  marginBottom: 1,
                  "&.Mui-selected": {
                    backgroundColor: "#fe3333",
                    color: "#fff",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#cc2a2a",
                  },
                }}
              >
                <ListItemText primary={part.name} sx={{ fontWeight: 500 }} />
              </ListItem>
            ))
          )}
        </List>
      </Box>

      <Box width="80%" bgcolor="#000000">
        <Canvas camera={{ fov: 75 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <AutoFitCamera models={models} />
          {models.map((model, index) => (
            <Model key={index} model={model} selectedPartName={selectedPart} />
          ))}
          <OrbitControls />
        </Canvas>
      </Box>

      <Toast
        open={toastOpen}
        message="Render Saved Successfully!"
        severity="success"
        handleClose={handleClose}
      />
    </Box>
  );
};

export default CanvasView;
