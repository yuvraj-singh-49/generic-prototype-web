import { useState } from "react";
import FileUpload from "./FileUpload";
import CanvasView from "./CanvasView";

interface PrototypeViewProps {
  isCanvasViewOpen?: boolean;
  fileUrlList?: any;
}

const PrototypeView: React.FC<PrototypeViewProps> = ({
  isCanvasViewOpen,
  fileUrlList,
}) => {
  const [fileUrlListData, setFileUrlListData] = useState(fileUrlList ?? {});
  const [canvasViewOpen, setCanvasViewOpen] = useState(
    isCanvasViewOpen ?? false
  );

  if (canvasViewOpen) {
    return <CanvasView fileUrlList={fileUrlListData}  />;
  }

  return (
    <FileUpload
      onFilesUploaded={(data: any) => setFileUrlListData(data)}
      onContinue={() => setCanvasViewOpen(true)}
    />
  );
};

export default PrototypeView;
