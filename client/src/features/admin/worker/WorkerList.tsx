import { Delete, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Grid,
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
import AppPagination from "../../../app/components/AppPagination";
import CheckboxButtons from "../../../app/components/CheckboxButtons";
import useWorkers from "../../../app/hooks/useWorkers";
import { Worker } from "../../../app/models/workers";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/store/configureStore";
import WorkerForm from "./WorkerForm";
import WorkerSearch from "./WorkerSearch";
import { removeWorker, setPageNumber, setWorkerParams } from "./workerSlice";

export default function WorkerList() {
  const { workers, metaData, duties } = useWorkers();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const { workerParams } = useAppSelector((state) => state.worker);
  const [selectedWorker, setSelectedWorker] = useState<Worker | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectWorker(worker: Worker) {
    setSelectedWorker(worker);
    setEditMode(true);
  }

  function handleDeleteWorker(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteWorker(id)
      .then(() => dispatch(removeWorker(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedWorker) setSelectedWorker(undefined);
    setEditMode(false);
  }
  if (editMode)
    return <WorkerForm worker={selectedWorker} cancelEdit={cancelEdit} />;

  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <Paper sx={{ mb: 2 }}>
          <WorkerSearch />
        </Paper>
        <Paper sx={{ mb: 2, p: 2 }}>
          <CheckboxButtons
            items={duties}
            checked={workerParams.duties}
            onChange={(items: any[]) =>
              dispatch(setWorkerParams({ duties: items }))
            }
          />
        </Paper>
      </Grid>
      <Grid item xs={9}>
        <Box display="flex" justifyContent="space-between">
          <Typography sx={{ p: 2 }} variant="h4">
            Worker List
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
                <TableCell align="left">Image</TableCell>
                <TableCell align="center">Fullname</TableCell>
                <TableCell align="center">Duty</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workers.map((worker) => (
                <TableRow
                  key={worker.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {worker.id}
                  </TableCell>
                  <TableCell align="left">
                    <Box display="flex" alignItems="center">
                      <img
                        src={worker.pictureUrl}
                        alt={worker.name}
                        style={{ height: 50, marginRight: 20 }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    {worker.name} {worker.surname}
                  </TableCell>
                  <TableCell align="center">{worker.duty}</TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleSelectWorker(worker)}
                      startIcon={<Edit />}
                    />
                    <LoadingButton
                      loading={loading && target === worker.id}
                      startIcon={<Delete />}
                      color="error"
                      onClick={() => handleDeleteWorker(worker.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        {metaData && (
          <Box sx={{ pt: 2 }}>
            <AppPagination
              metaData={metaData}
              onPageChange={(page: number) =>
                dispatch(setPageNumber({ pageNumber: page }))
              }
            />
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
