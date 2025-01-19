"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Checkbox,
  Select,
  MenuItem,
  Tab,
  Tabs,
} from "@mui/material";
import DetailOfflineOrder from "../../../(public)/components/DetailOfflineOrder";

const OfflineTransactionPage = () => {
  const [barangList, setBarangList] = useState([]);
  const [jasaList, setJasaList] = useState([]);
  const [addOnList, setAddOnList] = useState([]);
  const [filteredAddOnList, setFilteredAddOnList] = useState([]); // Filtered add-on list

  const [activeTab, setActiveTab] = useState(0); // Mengatur tab aktif
  const [enableAddOn, setEnableAddOn] = useState(false);

  const [selectedBarang, setSelectedBarang] = useState(null); // Change to store ID
  const [selectedJasa, setSelectedJasa] = useState(null); // Change to store ID
  const [selectedAddOns, setSelectedAddOns] = useState([]); // Multiple add-ons by ID
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [rows, setRows] = useState([]);
  const [qtyBarang, setQtyBarang] = useState(1);
  const [qtyJasa, setQtyJasa] = useState(1);
  const [qtyAddOn, setQtyAddOn] = useState(1);
  const [lembarJasa, setLembarJasa] = useState(1);
  const [addOnQuantities, setAddOnQuantities] = useState({}); // Add-on quantities

  const todayDate = new Date().toLocaleDateString("en-US");

  // Fetch data from APIs
  useEffect(() => {
    fetch("/api/barang")
      .then((res) => res.json())
      .then((data) => setBarangList(data));

    fetch("/api/jasa")
      .then((res) => res.json())
      .then((data) => setJasaList(data));

    fetch("/api/addon")
      .then((res) => res.json())
      .then((data) => setAddOnList(data));
  }, []);

  // Update filteredAddOnList when jasa is selected
  useEffect(() => {
    if (selectedJasa) {
      const selectedJasaData = jasaList.find(
        (jasa) => jasa._id === selectedJasa
      );
      if (selectedJasaData && selectedJasaData.addOns) {
        const filteredAddOns = addOnList.filter((addon) =>
          selectedJasaData.addOns.includes(addon._id)
        );
        setFilteredAddOnList(filteredAddOns);
      }
    } else {
      setFilteredAddOnList([]);
    }
  }, [selectedJasa, jasaList, addOnList]);

  // Handle adding a new row to the table
  const handleAdd = () => {
    if (selectedBarang || selectedJasa || selectedAddOn) {
      let newProduct;
      let qty;
      let harga;
      let lembar = 0;

      if (selectedBarang) {
        newProduct = barangList.find((b) => b._id === selectedBarang); // Use _id for barang
        qty = qtyBarang;
        harga = newProduct?.harga;
      } else if (selectedJasa) {
        newProduct = jasaList.find((j) => j._id === selectedJasa); // Use _id for jasa
        qty = qtyJasa;
        harga = newProduct?.harga;
        lembar = lembarJasa; // Calculate total lembar for jasa
      } else if (selectedAddOn) {
        newProduct = addOnList.find((a) => a._id === selectedAddOn); // Use _id for barang
        qty = qtyAddOn;
        harga = newProduct?.harga;
      }

      let addOnDetails = enableAddOn
        ? selectedAddOns.map((addonId) => {
            const addon = addOnList.find((a) => a._id === addonId);
            return {
              harga: addon.harga,
              name: addon.nama,
              id: addon._id,
              qty: addOnQuantities[addonId] || 1,
              tipeHarga: addon.tipeHarga,
              subtotal: addon.harga * addOnQuantities[addonId],
            };
          })
        : [];

      const addOnPrice = addOnDetails.reduce((sum, addon) => {
        const addonHarga =
          addOnList.find((a) => a._id === addon.id)?.harga || 0;
        return sum + addonHarga * addon.qty;
      }, 0);

      const subtotal =
        lembar == 0
          ? harga * qty + addOnPrice
          : harga * qty * lembar + addOnPrice;

      // Menambahkan row dengan data produk lengkap
      const newRow = {
        tanggal: todayDate,
        product: newProduct, // Menyimpan objek produk lengkap
        jumlah: qty,
        lembar: lembar,
        tipe: newProduct.idBarang
          ? "barang"
          : newProduct.idJasa
          ? "jasa"
          : "addon",
        harga: `Rp. ${(harga * qty).toLocaleString()}`,
        addOn: addOnDetails.length
          ? addOnDetails.map((a) => `${a.name} (Qty: ${a.qty})`).join("<br />")
          : "-",
        addOnsDetails: addOnDetails,
        subtotal: `Rp. ${subtotal.toLocaleString()}`,
      };

      setRows([...rows, newRow]);

      // Reset fields
      setSelectedBarang(null);
      setSelectedJasa(null);
      setSelectedAddOns([]);
      setEnableAddOn(false);
      setQtyBarang(1);
      setQtyJasa(1);
      setLembarJasa(1);
      setAddOnQuantities({});
    } else {
      alert("Please select a Product, Service, or Add-Ons first!");
    }
  };

  // Handle checkbox change for add-ons
  const handleAddOnCheckboxChange = (addonId) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId)
        ? prev.filter((id) => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Handle delete row from table
  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleSubmit = async () => {
    if (rows.length == 0) {
      alert("No items have been added!");
    } else {
      const barang = rows.filter((row) => row.tipe === "barang");
      const jasa = rows.filter((row) => row.tipe === "jasa");
      const addon = rows.filter((row) => row.tipe === "addon");

      const payload = {
        barang: barang,
        jasa: jasa,
        addon: addon,
        subtotal: rows.reduce(
          (acc, row) => acc + parseInt(row.subtotal.replace(/\D/g, ""), 10),
          0
        ),
        total: rows.reduce(
          (acc, row) => acc + parseInt(row.subtotal.replace(/\D/g, ""), 10),
          0
        ),
      };
      console.log(payload);

      try {
        const response = await fetch("/api/transaction/offline", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || "Terjadi kesalahan saat menyimpan transaksi."
          );
        }
        setSelectedOrder(data.data);
        alert("Transaction successful!");
        setRows([]);
      } catch (error) {
        alert("Failed to complete transaction: " + error.message);
      }
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography
          variant="h4"
          gutterBottom
          color="black"
          mb={3}
          fontWeight="bold"
        >
          Pencatatan Transaksi Offline
        </Typography>
        <Typography variant="h6" color="black" fontWeight="bold">
          Date: {todayDate}
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        {/* Left section for adding barang or jasa */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#FFFFFF", // Warna putih
            padding: 2, // Padding sekitar form
            borderRadius: 2, // Agar pojok form membulat
            boxShadow: 2, // Tambahkan shadow jika ingin efek lebih baik
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            centered
          >
            <Tab label="Products" />
            <Tab label="Services" />
            <Tab label="Add-Ons" />
          </Tabs>
          {activeTab === 0 && (
            <Box>
              <TextField
                select
                value={selectedBarang || ""}
                onChange={(e) => {
                  setSelectedBarang(e.target.value);
                  setSelectedJasa(null);
                  setSelectedAddOn(null);
                  setEnableAddOn(false);
                  setQtyAddOn(1);
                  setQtyJasa(1);
                  setLembarJasa(1);
                }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">-- Select Product --</option>
                {barangList.map((barang) => (
                  <option key={barang._id} value={barang._id}>
                    {barang.nama}
                  </option>
                ))}
              </TextField>
              <TextField
                type="number"
                label="Qty"
                value={qtyBarang}
                onChange={(e) => setQtyBarang(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 1 }}
                sx={{ mt: 1 }}
              />
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <TextField
                select
                value={selectedJasa || ""}
                onChange={(e) => {
                  setSelectedJasa(e.target.value);
                  setSelectedBarang(null);
                  setSelectedAddOn(null);
                  setEnableAddOn(true);
                  setQtyBarang(1);
                  setQtyAddOn(1);
                }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">-- Select Service --</option>
                {jasaList.map((jasa) => (
                  <option key={jasa._id} value={jasa._id}>
                    {jasa.nama}
                  </option>
                ))}
              </TextField>
              <TextField
                type="number"
                label="Qty"
                value={qtyJasa}
                onChange={(e) => setQtyJasa(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 1 }}
                sx={{ mt: 1 }}
              />

              {selectedJasa && (
                <TextField
                  type="number"
                  label="Lembar"
                  value={lembarJasa}
                  onChange={(e) => setLembarJasa(Number(e.target.value))}
                  fullWidth
                  inputProps={{ min: 1 }}
                  sx={{ mt: 1 }}
                />
              )}

              {enableAddOn && (
                <div>
                  <Typography>Add Add-Ons</Typography>
                  {filteredAddOnList.map((addon) => (
                    <Box
                      key={addon._id}
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Checkbox
                        checked={selectedAddOns.includes(addon._id)}
                        onChange={() => handleAddOnCheckboxChange(addon._id)}
                      />
                      <Typography>{addon.nama}</Typography>
                      <TextField
                        type="number"
                        label="Qty"
                        value={addOnQuantities[addon._id] || 1}
                        onChange={(e) =>
                          setAddOnQuantities({
                            ...addOnQuantities,
                            [addon._id]: Number(e.target.value),
                          })
                        }
                        inputProps={{ min: 1 }}
                        fullWidth
                        sx={{ mt: 1, ml: 2 }}
                      />
                    </Box>
                  ))}
                </div>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <TextField
                select
                value={selectedAddOn || ""}
                onChange={(e) => {
                  setSelectedBarang(null);
                  setSelectedJasa(null);
                  setSelectedAddOn(e.target.value);
                  setEnableAddOn(false);
                  setQtyBarang(1);
                  setQtyJasa(1);
                  setLembarJasa(1);
                }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">-- Select Add Ons --</option>
                {addOnList.map((addon) => (
                  <option key={addon._id} value={addon._id}>
                    {addon.nama}
                  </option>
                ))}
              </TextField>
              <TextField
                type="number"
                label="Qty"
                value={qtyAddOn}
                onChange={(e) => setQtyAddOn(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 1 }}
                sx={{ mt: 1 }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleAdd}
            sx={{ mt: 3 }}
          >
            Add to Table
          </Button>
        </Box>

        {/* Right section for showing table */}
        <Box sx={{ flex: 2 }}>
          <Typography variant="h6" fontWeight="bold">
          Added Transactions
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                <TableCell>Product</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Pages</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Add-Ons</TableCell>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.product.nama}</TableCell>
                    <TableCell>{row.jumlah}</TableCell>
                    <TableCell>{row.lembar}</TableCell>
                    <TableCell>{row.harga}</TableCell>
                    <TableCell
                      dangerouslySetInnerHTML={{ __html: row.addOn }}
                    />
                    <TableCell>{row.subtotal}</TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => handleDelete(index)}>
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ mt: 3 }}
          >
            Complete
          </Button>
        </Box>
      </Box>
      {selectedOrder && (
        <DetailOfflineOrder
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </Container>
  );
};

export default OfflineTransactionPage;
