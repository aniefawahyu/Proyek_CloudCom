"use client";

import { useEffect, useState } from "react";
import ItemForm from "../../components/ItemForm";
import { CircularProgress } from "@mui/material";

const EditItemPage = ({ params }) => {
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchParams = async () => {
      // Mengambil nilai id dari params
      const { id } = await params;
      setId(id);
    };

    fetchParams(); // Panggil fungsi untuk mengambil id dari params
  }, [params]);

  if (!id) {
    return <CircularProgress />;
  }

  return (
    <div>
      <ItemForm mode="edit" id={id} />
    </div>
  );
};

export default EditItemPage;
