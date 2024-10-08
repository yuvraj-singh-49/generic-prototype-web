import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Paper,
  Divider,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BomTable from "./BomTable";
import PrototypeView from "./PrototypeView";
import axiosApi from "../app/config";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog"; // Import the dialog component
import Toast from "./Toast";

const PreviousRenders: React.FC = () => {
  const [previousRenders, setPreviousRenders] = useState([]);
  const [previousRenderOpen, setPreviousRenderOpen] = useState(false);
  const [fileUrlList, setFileUrlList] = useState<string[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [renderToDelete, setRenderToDelete] = useState<any>(null);
  const [toastData, setToastData] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const renderTable = async () => {
      const response: any = await axiosApi().get(`/api/getAll`);

      if (response?.status === 200) {
        setPreviousRenders(response?.data);
      } else {
        setToastData({
          open: true,
          message: response?.message ?? "Failed to delete the render.",
          severity: "error",
        });
      }
    };

    renderTable();
  }, []);

  const renderCanvas = (render: any) => {
    setFileUrlList(render?.fileUrlList);
    setTimeout(() => {
      setPreviousRenderOpen(true);
    }, 0);
  };

  const handleOpenDeleteDialog = (render: any) => {
    setRenderToDelete(render);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setRenderToDelete(null);
  };

  const handleDelete = async () => {
    if (!renderToDelete) return;

    try {
      const response = (await axiosApi().delete(
        `/api/delete/${renderToDelete._id}`
      )) as any;
      if (response?.status === 200) {
        setToastData({
          open: true,
          message: "Render Deleted Successfully!",
          severity: "success",
        });
        setPreviousRenders((prevRenders) =>
          prevRenders.filter(
            (render) => (render as any)._id !== renderToDelete._id
          )
        );
      } else {
        setToastData({
          open: true,
          message: response?.message ?? "Failed to delete the render.",
          severity: "error",
        });
      }
    } catch (error: any) {
      setToastData({
        open: true,
        message:
          error?.message ?? "An error occurred while deleting the render.",
        severity: "error",
      });
    }

    handleCloseDeleteDialog();
  };

  if (previousRenderOpen) {
    return (
      <PrototypeView
        isCanvasViewOpen={true}
        fileUrlList={fileUrlList}
        savedRender={true}
      />
    );
  }

  const handleClose = () => {
    setToastData({
      open: false,
      message: "",
      severity: "",
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Previous Prototypes
      </Typography>
      <List
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {previousRenders.map((render: any) => (
          <Paper
            key={render._id}
            elevation={3}
            sx={{
              marginBottom: 3,
              padding: 2,
              borderRadius: 2,
              width: "70%",
              backgroundColor: "#f9f9f9",
              "&:hover": {
                backgroundColor: "#f1f1f1",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#333" }}
                    >
                      {render.name}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#888" }}>
                      Rendered on:{" "}
                      {new Date(render.createdOn).toLocaleDateString()}
                    </Typography>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "32px",
                    }}
                  >
                    <Button
                      onClick={() => renderCanvas(render)}
                      color="primary"
                      variant="outlined"
                      sx={{ borderRadius: "20px", padding: "6px 20px" }}
                    >
                      Render
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleOpenDeleteDialog(render)}
                      sx={{
                        backgroundColor: "#f44336",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#d32f2f",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>

                <Divider sx={{ marginY: 2 }} />
                <BomTable bom={render?.bom} />
              </Box>
            </Box>
          </Paper>
        ))}
      </List>

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDelete}
        renderName={renderToDelete?.name}
      />

      <Toast
        open={toastData?.open}
        message={toastData?.message}
        severity={toastData?.severity as any}
        handleClose={handleClose}
      />
    </Box>
  );
};

export default PreviousRenders;
