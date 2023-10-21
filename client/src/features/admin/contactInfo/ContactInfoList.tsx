import { useState } from "react";
import useContactInfo from "../../../app/hooks/useContactInfo";
import { useAppDispatch } from "../../../app/store/configureStore";
import { ContactInfo } from "../../../app/models/contactInfo";
import agent from "../../../app/api/agent";
import { removeContactInfo } from "./contactInfoSlice";
import ContactInfoForm from "./ContactInfoForm";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function ContactInfoList() {
  const { contactInfo } = useContactInfo();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selectedContactInfo, setSelectedContactInfo] = useState<
    ContactInfo | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(0);

  function handleSelectContactInfo(contactInfo: ContactInfo) {
    setSelectedContactInfo(contactInfo);
    setEditMode(true);
  }

  function handleDeleteContactInfo(id: number) {
    setLoading(true);
    setTarget(id);
    agent.Admin.deleteContactInfo(id)
      .then(() => dispatch(removeContactInfo(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selectedContactInfo) setSelectedContactInfo(undefined);
    setEditMode(false);
  }

  if (editMode)
    return (
      <ContactInfoForm
        contactInfo={selectedContactInfo}
        cancelEdit={cancelEdit}
      />
    );

  if (!contactInfo.length)
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
              <TableCell align="center">Address</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactInfo.map((info) => (
              <TableRow
                key={info.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {info.id}
                </TableCell>
                <TableCell align="center">{info.address}</TableCell>
                <TableCell align="center">{info.phoneNumber1}</TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleSelectContactInfo(info)}
                    startIcon={<Edit />}
                  />
                  <LoadingButton
                    loading={loading && target === info.id}
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDeleteContactInfo(info.id)}
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
