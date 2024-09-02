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
  CircularProgress,
  Checkbox,
  ListItemIcon,
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
  fileUrlList: string[];
  savedRender: any;
}

// Component to adjust the camera based on the model's size
const AutoFitCamera: React.FC<{ models: Model[] }> = ({ models }) => {
  const { camera, controls } = useThree() as any;

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
const ModelComponent: React.FC<{
  model: Model;
  selectedParts: string[];
  hoveredPartName: string | null;
}> = ({ model, selectedParts, hoveredPartName }) => {
  return (
    <group>
      {model.parts.map((part, index) => (
        <mesh
          key={index}
          geometry={part.geometry as any}
          material={
            selectedParts.includes(part.name)
              ? new THREE.MeshStandardMaterial({ color: 0xff0000 }) // Highlight selected parts
              : part.name === hoveredPartName
              ? new THREE.MeshStandardMaterial({ color: 0xffff00 }) // Highlight hovered part
              : part.material // Use original material for non-selected and non-hovered parts
          }
        />
      ))}
    </group>
  );
};

const CanvasView: React.FC<CanvasViewProps> = ({
  fileUrlList,
  savedRender,
}) => {
  const [toastData, setToastData] = useState({
    open: false,
    message: "",
    severity: "",
  });
  const [fileSaved, setFileSaved] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [bom, setBom] = useState<Record<string, number>>({});
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
          setToastData({
            open: true,
            message: `Error loading model ${fileName}:`,
            severity: "error",
          });
        }
      }

      setModels(loadedModels);
      setBom(completeBom);
      setLoading(false);
    }

    if (fileUrlList.length > 0) {
      setLoading(true);
      loadModels();
    }
  }, [fileUrlList]);

  const handleToggleSelection = (partName: string) => {
    setSelectedParts((prevSelectedParts) =>
      prevSelectedParts.includes(partName)
        ? prevSelectedParts.filter((name) => name !== partName)
        : [...prevSelectedParts, partName]
    );
  };

  const handleRenderingSave = async () => {
    const data = JSON.stringify({
      name: "Prototype No. " + parseInt((Math.random() * 10000) as any),
      bom: bom,
      fileUrlList: fileUrlList,
      createdOn: new Date(),
    });

    try {
      const response = await axiosApi().post(`/api/post`, data);
      if (response.status === 200) {
        setToastData({
          open: true,
          message: "Prototype Saved Successfully!",
          severity: "success",
        });
        setFileSaved(true);
      } else {
        setToastData({
          open: true,
          message: response?.message ?? "Failed to delete the render.",
          severity: "error",
        });
      }
    } catch (error) {
      setToastData({
        open: true,
        message:
          error?.message ?? "An error occurred while deleting the render.",
        severity: "error",
      });
    }
  };

  const handleClose = () => {
    setToastData({
      open: false,
      message: "",
      severity: "",
    });
  };

  return (
    <Box display="flex" height="90vh">
      <Box
        width="20%"
        bgcolor="#f5f5f5"
        p={2}
        overflow="auto"
        sx={{
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        {!savedRender ? (
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
              disabled={fileSaved || loading}
            >
              Save this Rendering
            </Button>
          </Paper>
        ) : null}

        {!loading && models.length > 0 && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: 700, color: "#333" }}
            >
              Interactive Elements
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
          </>
        )}
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
          >
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {models.map((model, modelIndex) =>
              model.parts.map((part, partIndex) => (
                <ListItem
                  button
                  key={`${modelIndex}-${partIndex}`}
                  selected={selectedParts.includes(part.name)}
                  onClick={() => handleToggleSelection(part.name)}
                  onMouseEnter={() => setHoveredPart(part.name)}
                  onMouseLeave={() => setHoveredPart(null)}
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
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedParts.includes(part.name)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText primary={part.name} sx={{ fontWeight: 500 }} />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Box>

      <Box width="80%" bgcolor="#000000">
        <Canvas camera={{ fov: 75 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <pointLight position={[-10, -10, -10]} />
          <AutoFitCamera models={models} />
          {models.map((model, index) => (
            <ModelComponent
              key={index}
              model={model}
              selectedParts={selectedParts}
              hoveredPartName={hoveredPart}
            />
          ))}
          <OrbitControls />
        </Canvas>
      </Box>

      <Toast
        open={toastData?.open}
        message={toastData?.message}
        severity={toastData?.severity as any}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default CanvasView;
