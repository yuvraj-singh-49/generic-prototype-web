// @ts-nocheck

import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const DeleteConfirmationDialog = ({ open, onClose, onDelete, renderName }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 3, // Round edges for the modal
          padding: 3,
          backgroundColor: "#fafafa", // Light background color
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.1)", // Soft shadow
        },
      }}
    >
      <DialogTitle
        id="delete-dialog-title"
        sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}
      >
        {"Are you sure you want to delete "}
        {renderName}
        {"?"}
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        <Typography>This action cannot be undone.</Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          sx={{ borderRadius: "20px", padding: "6px 20px" }}
        >
          Back
        </Button>
        <Button
          onClick={onDelete}
          color="error"
          variant="contained"
          sx={{ borderRadius: "20px", padding: "6px 20px" }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
