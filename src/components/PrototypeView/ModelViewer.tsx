import React, { useEffect, useState } from "react";
import { extractParts } from "../../common/methods";

// Define the type for a part object
interface Part {
  name: string;
  [key: string]: any;
}

interface ModelViewerProps {
  url: string;
  fileType: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({ url, fileType }) => {
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    async function loadModel() {
      try {
        const extractedParts: any = await extractParts(url, fileType);
        setParts(extractedParts);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    }

    loadModel();
  }, [url, fileType]);

  return (
    <div>
      <h2>Model Parts</h2>
      <ul>
        {parts.map((part, index) => (
          <li key={index}>{part.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ModelViewer;
