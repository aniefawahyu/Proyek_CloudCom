"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Grid2,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";
import HelpPopover from "../../components/HelpPopover";
import CenterLoading from "../../components/CenterLoading";

const ProductDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [addOnList, setAddOnList] = useState([]);
  const [filteredAddOnList, setFilteredAddOnList] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [notes, setNotes] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [sub, setSub] = useState(0);
  const router = useRouter();

  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const calculateSubtotal = () => {
    let subAddOn = 0;

    // Hitung subtotal add-on
    const faon = filteredAddOnList.filter((item) =>
      selectedAddOns.find((it) => it.id === item._id)
    );

    for (const aon of faon) {
      if (aon.tipeHarga === "lembar") {
        subAddOn += aon.harga * (pageCount || 1) * quantity;
      } else {
        subAddOn += aon.harga * quantity;
      }
    }

    // Subtotal utama (harga jasa * pageCount * quantity) + add-on
    const subtotal =
      Number.parseInt(service?.harga || 0) * (pageCount || 1) * quantity +
      subAddOn;

    setSub(subtotal);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/jasa/${id}`);
        if (!response.ok) throw new Error("Failed to fetch service details");
        const data = await response.json();
        setService(data);
        setSub(data.harga);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

      try {
        const res = await fetch("/api/addon");
        if (!res.ok) throw new Error("Failed to fetch add-ons");
        const data = await res.json();
        setAddOnList(data);
      } catch (err) {
        setError("Error fetching add-ons: " + err.message);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (service && service.addOns) {
      const filteredAddOns = addOnList.filter((addon) =>
        service.addOns.includes(addon._id)
      );
      setFilteredAddOnList(filteredAddOns);
    }
  }, [service, addOnList]);

  useEffect(() => {
    validateForm();
  }, [uploadedFile, quantity, selectedAddOns]);

  const validateForm = () => {
    const isValid = uploadedFile !== null && quantity > 0;
    setIsFormValid(isValid);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        event.target.value = null; // Reset file input
        return;
      }

      setUploadedFile(file);

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          setPageCount(pdf.numPages);
        } catch (err) {
          setError("Failed to read the PDF file.");
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    } else {
      const data = await res.json();
      throw new Error(data.error || "Failed to upload the PDF file.");
    }
  };

  useEffect(() => {
    calculateSubtotal();
  }, [quantity, pageCount, selectedAddOns]);

  const handleAddToCart = async () => {
    setButtonLoading(true);
    let fileUrl = "";
    try {
      // prioritas cek file dulu
      fileUrl = await uploadFile(uploadedFile);

      // cek addon nya
      let faon = filteredAddOnList.filter((item) =>
        selectedAddOns.find((it) => it.id == item._id)
      );
      let subAddOn = 0;
      for (const aon of faon) {
        console.log(aon);

        if (aon.tipeHarga == "lembar") {
          subAddOn += aon.harga * pageCount * quantity;
        } else {
          subAddOn += aon.harga * quantity;
        }
      }
      console.log(faon);
      let items = {};
      if (selectedAddOns) {
        items = {
          jasaId: service._id,
          nama: service.nama,
          harga: service.harga,
          lembar: pageCount,
          file: fileUrl,
          qty: quantity,
          notes: notes,
          subtotal:
            Number.parseInt(service.harga) * pageCount * quantity + subAddOn,
          addOns: faon.map((i) => {
            return {
              addOnId: i._id,
              nama: i.nama,
              harga: i.harga,
              qty: i.tipeHarga == "lembar" ? quantity * pageCount : quantity,
              tipeHarga: i.tipeHarga,
              subtotal:
                i.tipeHarga == "lembar"
                  ? i.harga * quantity * pageCount
                  : i.harga * quantity,
            };
          }),
        };
      } else {
        items = {
          jasaId: service._id,
          nama: service.nama,
          harga: service.harga,
          lembar: pageCount,
          file: fileUrl,
          qty: quantity,
          subtotal:
            Number.parseInt(service.harga) * pageCount * quantity + subAddOn,
        };
      }

      console.log(items);

      const cartData = { items };

      console.log(cartData);

      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cartData),
      });

      if (res.ok) {
        alert("Item added to cart!");
        router.push("/cart");
      } else {
        alert("Failed to add item to cart.");
        setButtonLoading(false);
      }
    } catch (error) {
      setError(error);
      setButtonLoading(false);
    }
  };

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.id === addon._id)
        ? prev.filter((a) => a.id !== addon._id)
        : [...prev, { id: addon._id, nama: addon.nama, harga: addon.harga }]
    );
  };

  if (loading) {
    return <CenterLoading />;
  }

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container sx={{ marginTop: 4, marginBottom: 4 }}>
      <Card>
        <Grid2 container spacing={2}>
          {/* Gambar Jasa */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <CardMedia
              component="img"
              image={service.gambar}
              alt={service.nama}
              sx={{ height: 400, objectFit: "contain" }}
            />
          </Grid2>

          {/* Input dan Kontrol */}
          <Grid2 size={{ xs: 12, md: 6 }}>
            <CardContent>
              <Typography variant="h4">{service.nama}</Typography>
              <Typography gutterBottom>Price: Rp {service.harga}</Typography>

              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                fullWidth
                sx={{ marginBottom: 2 }}
              />

              <Typography>Upload File: PDF*</Typography>
              <TextField
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              {uploadedFile && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {pageCount !== null && `Pages: ${pageCount}`}
                </Typography>
              )}

              {filteredAddOnList.map((addon) => (
                <FormControlLabel
                  key={addon._id}
                  control={
                    <Checkbox
                      onChange={() => toggleAddOn(addon)}
                      checked={selectedAddOns.some((a) => a.id === addon._id)}
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center">
                      <Typography>
                        <b>{addon.nama}</b> - Rp{" "}
                        {addon.harga.toLocaleString("id-ID")}/{addon.tipeHarga}
                      </Typography>
                      <HelpPopover
                        nama={addon.nama}
                        image={addon.gambar}
                        description={addon.deskripsi}
                      />
                    </Box>
                  }
                />
              ))}

              {/* Textarea untuk Notes */}
              <TextField
                label="Notes"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                sx={{ marginTop: 2 }}
              />

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mt={2}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                  disabled={!isFormValid || buttonLoading} // Button tidak aktif saat loading
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {buttonLoading ? (
                    <CircularProgress size={24} color="inherit" /> // Tampilkan loading saat proses berjalan
                  ) : (
                    "Add to Cart" // Teks normal jika tidak loading
                  )}
                </Button>
                <Typography variant="h6" sx={{ marginLeft: 2 }}>
                  Subtotal: Rp {sub.toLocaleString("id-ID")}
                </Typography>
              </Box>
            </CardContent>
          </Grid2>
        </Grid2>
      </Card>
    </Container>
  );
};

export default ProductDetail;
