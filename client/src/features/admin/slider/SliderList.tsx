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
import useSliders from "../../../app/hooks/useSliders";
import { useAppDispatch } from "../../../app/store/configureStore";
import { useState } from "react";
import { AppSlider } from "../../../app/models/slider";
import agent from "../../../app/api/agent";
import { removeSlider, setPageNumber } from "./sliderSlice";
import SliderForm from "./SliderForm";
import { Edit, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import AppPagination from "../../../app/components/AppPagination";

export default function SliderList() {
  const { sliders, metaData } = useSliders();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedSlider, setSelectedSlider] = useState<AppSlider | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectSlider(slider: AppSlider) {
    setSelectedSlider(slider);
    setEditMode(true);
  }

  function handleDeleteSlider(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteSlider(id)
      .then(() => dispatch(removeSlider(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedSlider) setSelectedSlider(undefined);
    setEditMode(false);
  }

  if (editMode)
    return <SliderForm slider={selectedSlider} cancelEdit={cancelEdit} />;

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Typography sx={{ p: 2 }} variant="h4">
          Sliders
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
              <TableCell align="left">Picture</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="center">Subtitle</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sliders.map((slider) => (
              <TableRow
                key={slider.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {slider.id}
                </TableCell>
                <TableCell align="left">
                  <Box display="flex" alignItems="center">
                    <img
                      src={slider.pictureUrl}
                      alt={slider.title}
                      style={{ height: 50, marginRight: 20 }}
                    />
                  </Box>
                </TableCell>
                <TableCell align="left">{slider.title}</TableCell>
                <TableCell align="center">{slider.subtitle}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleSelectSlider(slider)}
                    startIcon={<Edit />}
                  />
                  <LoadingButton
                    loading={loading && target === slider.id}
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDeleteSlider(slider.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
    </>
  );
}
