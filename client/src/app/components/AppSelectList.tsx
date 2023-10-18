import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";

interface Props extends UseControllerProps {
  label: string;
  items: any[] | null;
}
export default function AppSelecList(props: Props) {
  const { fieldState, field } = useController({ ...props, defaultValue: "" });
  const itemsToRender = props.items || [];
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={field.value}
        label={props.label}
        onChange={field.onChange}
      >
        {itemsToRender.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  );
}
