import { useState } from "react";
import FileUpload from "./FileUpload";
import CanvasView from "./CanvasView";

interface PrototypeViewProps {
  isCanvasViewOpen?: boolean;
  fileUrlList?: any;
  savedRender?: boolean;
}

const PrototypeView: React.FC<PrototypeViewProps> = ({
  isCanvasViewOpen,
  fileUrlList,
  savedRender,
}) => {
  const [fileUrlListData, setFileUrlListData] = useState(fileUrlList ?? {});
  const [canvasViewOpen, setCanvasViewOpen] = useState(
    isCanvasViewOpen ?? false
  );

  if (canvasViewOpen) {
    return <CanvasView fileUrlList={fileUrlListData} savedRender={savedRender}  />;
  }

  return (
    <FileUpload
      onFilesUploaded={(data: any) => setFileUrlListData(data)}
      onContinue={() => setCanvasViewOpen(true)}
    />
  );
};

export default PrototypeView;
