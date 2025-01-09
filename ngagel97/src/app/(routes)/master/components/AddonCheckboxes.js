"use client";

import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function AddonCheckboxes({ selectedAddons, setSelectedAddons }) {
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const res = await fetch("/api/addon");
        const data = await res.json();
        setAddons(data);
      } catch (error) {
        console.error("Error fetching add-ons:", error);
      }
    };

    fetchAddons();
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedAddons(typeof value === "string" ? value.split(",") : value);
  };

  const getSelectedAddonsNames = () => {
    return selectedAddons
      .map((id) => {
        const addon = addons.find((addon) => addon._id === id);
        return addon ? addon.nama : null;
      })
      .filter(Boolean) // Menyaring nilai null yang tidak ada nama
      .join(", ");
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-checkbox-label">Pilih Add-On</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={selectedAddons}
        onChange={handleChange}
        input={<OutlinedInput label="Pilih Add-On" />}
        renderValue={getSelectedAddonsNames} // Menampilkan nama add-on
        MenuProps={MenuProps}
      >
        {addons.map((addon) => (
          <MenuItem key={addon._id} value={addon._id}>
            <Checkbox checked={selectedAddons.includes(addon._id)} />
            <ListItemText primary={addon.nama} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
