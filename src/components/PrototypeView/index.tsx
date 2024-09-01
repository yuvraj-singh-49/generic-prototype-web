import { useState } from "react";
import FileUpload from "./FileUpload";
import CanvasView from "./CanvasView";

interface PrototypeViewProps {
  isCanvasViewOpen?: boolean;
  fileUrlDataVal?: any;
}

const PrototypeView: React.FC<PrototypeViewProps> = ({
  isCanvasViewOpen,
  fileUrlDataVal,
}) => {
  const [fileUrlData, setFileUrlData] = useState(fileUrlDataVal ?? {});
  const [canvasViewOpen, setCanvasViewOpen] = useState(
    isCanvasViewOpen ?? false
  );

  if (canvasViewOpen) {
    return <CanvasView fileUrlData={fileUrlData} />;
  }

  return (
    <FileUpload
      onFilesUploaded={(data: any) => setFileUrlData(data)}
      onContinue={() => setCanvasViewOpen(true)}
    />
  );
};

export default PrototypeView;
