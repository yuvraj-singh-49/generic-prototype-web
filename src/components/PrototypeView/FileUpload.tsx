// @ts-nocheck

import axios from "axios";
import React, { useState } from "react";
import { useDropzone, FileRejection, DropEvent } from "react-dropzone";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import axiosApi from "../../app/config";

interface FileUploadProps {
  onFilesUploaded: (files: File[]) => void;
  onContinue: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesUploaded,
  onContinue,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/sla": [".stl"], // MIME type for STL files
      "application/octet-stream": [".fbx"], // MIME type for FBX files
      "application/obj": [".obj"], // MIME type for OBJ files
    },
    onDrop: async (
      acceptedFiles: File[],
      fileRejections: FileRejection[],
      event: DropEvent
    ) => {
      setUploading(true);
      try {
        const response = await handleFileUpload(acceptedFiles);
        setUploadedFiles(acceptedFiles);
        onFilesUploaded(response);
      } catch (error) {
        console.error("Error uploading files:", error);
      } finally {
        setUploading(false);
      }
    },
  });

  const handleFileUpload = async (files: File[]) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("photos", file);
    }

    const response = await axiosApi({
      "Content-Type": "multipart/form-data",
    }).post(`/api/filesUpload`, formData);

    if (response?.status === 200) {
      return response?.data;
    } else {
      console.error("Something went wrong!!!");
      return [];
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #90caf9",
          padding: "40px",
          borderRadius: "16px",
          textAlign: "center",
          backgroundColor: "#e3f2fd",
          color: "#0d47a1",
          cursor: "pointer",
          height: "350px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "45px 30px",
          transition: "background-color 0.3s, border-color 0.3s",
          "&:hover": {
            borderColor: "#42a5f5",
            backgroundColor: "#bbdefb",
          },
        }}
      >
        <input {...getInputProps()} webkitdirectory="true" directory="true" />
        <CloudUploadIcon sx={{ fontSize: 60, color: "#0d47a1" }} />
        <Typography variant="h6" sx={{ marginTop: 2, fontWeight: 500 }}>
          Click or drag to upload your 3D models
        </Typography>
        <Typography variant="body2" sx={{ marginTop: 1, color: "#0d47a1" }}>
          Accepted formats: STL, OBJ and FBX
        </Typography>

        {uploading && <CircularProgress sx={{ marginTop: 3 }} />}
      </Box>

      {uploadedFiles.length > 0 && (
        <Box sx={{ marginTop: 4 }}>
          <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 500 }}>
            Uploaded Files
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {uploadedFiles.map((file, index) => (
              <Paper
                key={index}
                sx={{ padding: 2, display: "flex", alignItems: "center" }}
              >
                <InsertDriveFileIcon sx={{ marginRight: 2 }} />
                <Typography variant="body2">
                  {file.name} ({(file.size / 1024).toFixed(2)} KB)
                </Typography>
              </Paper>
            ))}
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
          >
            <Button variant="contained" color="primary" onClick={onContinue}>
              Render
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
