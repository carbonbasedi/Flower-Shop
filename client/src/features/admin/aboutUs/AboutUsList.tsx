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
import useAboutUs from "../../../app/hooks/useAboutUs";
import { AboutUs } from "../../../app/models/aboutUs";
import { useAppDispatch } from "../../../app/store/configureStore";
import AboutUsForm from "./AboutUsForm";
import { removeAboutUs } from "./aboutUsSlice";

export default function AboutUsList() {
  const { aboutUs } = useAboutUs();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedAboutUs, setSelectedAboutUs] = useState<AboutUs | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectAboutUs(aboutUs: AboutUs) {
    setSelectedAboutUs(aboutUs);
    setEditMode(true);
  }

  function handleDeleteAboutUs(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteAboutUs(id)
      .then(() => dispatch(removeAboutUs(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedAboutUs) setSelectedAboutUs(undefined);
    setEditMode(false);
  }

  if (editMode)
    return <AboutUsForm aboutUs={selectedAboutUs} cancelEdit={cancelEdit} />;

  if (!aboutUs.length)
    return (
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          About us info
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
    );

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          About us info
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align="left">Picture</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="center">Subtitle</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {aboutUs.map((aboutUs) => (
              <TableRow
                key={aboutUs.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {aboutUs.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={aboutUs.pictureUrl}
                      alt={aboutUs.title}
                      style={{ height: 50, marginRight: 20 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">{aboutUs.title}</TableCell>
                <TableCell align="center">{aboutUs.subtitle}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleSelectAboutUs(aboutUs)}
                    startIcon={<Edit />}
                  />
                  <LoadingButton
                    loading={loading && target === aboutUs.id}
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDeleteAboutUs(aboutUs.id)}
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
