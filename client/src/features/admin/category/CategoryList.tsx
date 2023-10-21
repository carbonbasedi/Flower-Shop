import { useState } from "react";
import { useAppDispatch } from "../../../app/store/configureStore";
import { Category } from "../../../app/models/product";
import agent from "../../../app/api/agent";
import { removeCategory } from "./categorySlice";
import CategoryForm from "./CategoryForm";
import { Edit, Delete } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Typography,
  Button,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import useCateegories from "../../../app/hooks/useCategories";

export default function CategoryList() {
  const { categories } = useCateegories();
  const dispatch = useAppDispatch();
  const [editMode, setEditMode] = useState(false);
  const [selecetedCategory, setSelectedCategory] = useState<
    Category | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [target, setTarger] = useState(0);

  function handleSelectCategory(category: Category) {
    setSelectedCategory(category);
    setEditMode(true);
  }

  function handleDeleteCategory(id: number) {
    setLoading(true);
    setTarger(id);
    agent.Admin.deleteCategory(id)
      .then(() => dispatch(removeCategory(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }

  function cancelEdit() {
    if (selecetedCategory) setSelectedCategory(undefined);
    setEditMode(false);
  }

  if (editMode)
    return (
      <CategoryForm category={selecetedCategory} cancelEdit={cancelEdit} />
    );

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
              <TableCell align="center">Title</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {category.id}
                </TableCell>
                <TableCell align="center">{category.title}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => handleSelectCategory(category)}
                    startIcon={<Edit />}
                  />
                  <LoadingButton
                    loading={loading && target === category.id}
                    startIcon={<Delete />}
                    color="error"
                    onClick={() => handleDeleteCategory(category.id)}
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
