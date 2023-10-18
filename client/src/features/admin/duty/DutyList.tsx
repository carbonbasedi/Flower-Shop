import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import agent from "../../../app/api/agent";
import useDuties from "../../../app/hooks/useDuties";
import { Duty } from "../../../app/models/workers";
import { useAppDispatch } from "../../../app/store/configureStore";
import DutyForm from "./DutyForm";
import { removeDuty } from "./dutySlice";

export default function DutyList() {
  const { duties } = useDuties();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedDuty, setSelectedDuty] = useState<Duty | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectDuty(duty: Duty) {
    setSelectedDuty(duty);
    setEditMode(true);
  }

  function handleDeleteDuty(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteDuty(id)
      .then(() => dispatch(removeDuty(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedDuty) setSelectedDuty(undefined);
    setEditMode(false);
  }

  if (editMode) return <DutyForm duty={selectedDuty} cancelEdit={cancelEdit} />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Duty List
        </Typography>
        <Button
          onClick={() => setEditMode(true)}
          sx={{ m: 2 }}
          size="large"
          variant="contained"
        >
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Title</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {duties.map((duty) => (
              <TableRow
                key={duty.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {duty.id}
                </TableCell>
                <TableCell align="center">{duty.title}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectDuty(duty)}
                    startIcon={<Edit />}
                  />
                  <LoadingButton
                    loading={loading && target === duty.id}
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDeleteDuty(duty.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
