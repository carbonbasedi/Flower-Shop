import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useState } from "react";

interface Props {
  items: any[] | null;
  checked?: any[];
  onChange: (items: any[]) => void;
}

export default function CheckboxButtons({ items, checked, onChange }: Props) {
  const [checkedItems, setCheckedItems] = useState(checked || []);

  function handleCheck(value: string) {
    const currentIndex = checkedItems.findIndex((item) => item === value);
    let newChecked: string[] = [];
    if (currentIndex === -1) newChecked = [...checkedItems, value];
    else newChecked = checkedItems.filter((item) => item !== value);
    setCheckedItems(newChecked);
    onChange(newChecked);
  }

  return (
    <FormGroup>
      {items?.map((item) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={checkedItems.indexOf(item.title) !== -1}
              onClick={() => handleCheck(item.title)}
            />
          }
          label={item.title}
          key={item.id}
        />
      ))}
    </FormGroup>
  );
}
