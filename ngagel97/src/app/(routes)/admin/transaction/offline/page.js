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
  const [productList, setProductList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [addOnList, setAddOnList] = useState([]);
  const [filteredAddOnList, setFilteredAddOnList] = useState([]);

  const [activeTab, setActiveTab] = useState(0);
  const [enableAddOn, setEnableAddOn] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedAddOn, setSelectedAddOn] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [rows, setRows] = useState([]);
  const [qtyProduct, setQtyProduct] = useState(1);
  const [qtyService, setQtyService] = useState(1);
  const [qtyAddOn, setQtyAddOn] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [addOnQuantities, setAddOnQuantities] = useState({});

  const todayDate = new Date().toLocaleDateString("en-US");

  // Fetch data from APIs
  useEffect(() => {
    fetch("/api/barang")
      .then((res) => res.json())
      .then((data) => setProductList(data));

    fetch("/api/jasa")
      .then((res) => res.json())
      .then((data) => setServiceList(data));

    fetch("/api/addon")
      .then((res) => res.json())
      .then((data) => setAddOnList(data));
  }, []);

  // Update filteredAddOnList when service is selected
  useEffect(() => {
    if (selectedService) {
      const selectedServiceData = serviceList.find(
        (service) => service._id === selectedService
      );
      if (selectedServiceData && selectedServiceData.addOns) {
        const filteredAddOns = addOnList.filter((addon) =>
          selectedServiceData.addOns.includes(addon._id)
        );
        setFilteredAddOnList(filteredAddOns);
      }
    } else {
      setFilteredAddOnList([]);
    }
  }, [selectedService, serviceList, addOnList]);

  // Handle adding a new row to the table
  const handleAdd = () => {
    if (selectedProduct || selectedService || selectedAddOn) {
      let newProduct;
      let qty;
      let price;
      let pages = 0;

      if (selectedProduct) {
        newProduct = productList.find((p) => p._id === selectedProduct);
        qty = qtyProduct;
        price = newProduct?.harga;
      } else if (selectedService) {
        newProduct = serviceList.find((s) => s._id === selectedService);
        qty = qtyService;
        price = newProduct?.harga;
        pages = pageCount;
      } else if (selectedAddOn) {
        newProduct = addOnList.find((a) => a._id === selectedAddOn);
        qty = qtyAddOn;
        price = newProduct?.harga;
      }

      let addOnDetails = enableAddOn
        ? selectedAddOns.map((addonId) => {
            const addon = addOnList.find((a) => a._id === addonId);
            return {
              price: addon.harga,
              name: addon.nama,
              id: addon._id,
              qty: addOnQuantities[addonId] || 1,
              priceType: addon.tipeHarga,
              subtotal: addon.harga * addOnQuantities[addonId],
            };
          })
        : [];

      const addOnPrice = addOnDetails.reduce((sum, addon) => {
        const addonPrice =
          addOnList.find((a) => a._id === addon.id)?.harga || 0;
        return sum + addonPrice * addon.qty;
      }, 0);

      const subtotal =
        pages == 0
          ? price * qty + addOnPrice
          : price * qty * pages + addOnPrice;

      const newRow = {
        date: todayDate,
        product: newProduct,
        quantity: qty,
        pages: pages,
        type: newProduct.idBarang
          ? "product"
          : newProduct.idJasa
          ? "service"
          : "addon",
        price: `$ ${(price * qty).toLocaleString()}`,
        addOn: addOnDetails.length
          ? addOnDetails.map((a) => `${a.name} (Qty: ${a.qty})`).join("<br />")
          : "-",
        addOnsDetails: addOnDetails,
        subtotal: `$ ${subtotal.toLocaleString()}`,
      };

      setRows([...rows, newRow]);

      // Reset fields
      setSelectedProduct(null);
      setSelectedService(null);
      setSelectedAddOns([]);
      setEnableAddOn(false);
      setQtyProduct(1);
      setQtyService(1);
      setPageCount(1);
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
      alert("No items have been added to the cart!");
    } else {
      const products = rows.filter((row) => row.type === "product");
      const services = rows.filter((row) => row.type === "service");
      const addons = rows.filter((row) => row.type === "addon");

      const payload = {
        products: products,
        services: services,
        addons: addons,
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
            data.message || "An error occurred while saving the transaction."
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
          Offline Transaction Recording
        </Typography>
        <Typography variant="h6" color="black" fontWeight="bold">
          Date: {todayDate}
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        <Box
          sx={{
            flex: 1,
            backgroundColor: "#FFFFFF",
            padding: 2,
            borderRadius: 2,
            boxShadow: 2,
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
                value={selectedProduct || ""}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setSelectedService(null);
                  setSelectedAddOn(null);
                  setEnableAddOn(false);
                  setQtyAddOn(1);
                  setQtyService(1);
                  setPageCount(1);
                }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">-- Select Product --</option>
                {productList.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.nama}
                  </option>
                ))}
              </TextField>
              <TextField
                type="number"
                label="Qty"
                value={qtyProduct}
                onChange={(e) => setQtyProduct(Number(e.target.value))}
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
                value={selectedService || ""}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setSelectedProduct(null);
                  setSelectedAddOn(null);
                  setEnableAddOn(true);
                  setQtyProduct(1);
                  setQtyAddOn(1);
                }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">-- Select Service --</option>
                {serviceList.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.nama}
                  </option>
                ))}
              </TextField>
              <TextField
                type="number"
                label="Qty"
                value={qtyService}
                onChange={(e) => setQtyService(Number(e.target.value))}
                fullWidth
                inputProps={{ min: 1 }}
                sx={{ mt: 1 }}
              />

              {selectedService && (
                <TextField
                  type="number"
                  label="Pages"
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
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
                  setSelectedProduct(null);
                  setSelectedService(null);
                  setSelectedAddOn(e.target.value);
                  setEnableAddOn(false);
                  setQtyProduct(1);
                  setQtyService(1);
                  setPageCount(1);
                }}
                SelectProps={{ native: true }}
                fullWidth
              >
                <option value="">-- Select Add-Ons --</option>
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
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>{row.pages}</TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell
                      dangerouslySetInnerHTML={{ __html: row.addOn }}
                    />
                    <TableCell>{row.subtotal}</TableCell>
                    <TableCell>
                      <Button color="error" onClick={() => handleDelete(index)}>
                        Delete
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