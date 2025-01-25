"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Container,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const ITEMS_PER_PAGE = 10;

const SalesPage = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [openPreview, setOpenPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const previewRef = useRef(null);

  const formatCurrency = (amount) => `Rp. ${amount.toLocaleString("id-ID")},-`;

  const isDateRangeValid = () => {
    if (startDate && endDate) {
      return startDate.isBefore(endDate) || startDate.isSame(endDate);
    }
    return true;
  };

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      setTransactions(response.data.data.orders || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const groupTransactionsByDate = (filteredTransactions = transactions) => {
    const grouped = filteredTransactions.reduce((acc, transaction) => {
      const user = users.find((u) => u._id === transaction.userId);
      const admin = users.find((u) => u._id === transaction.adminId);
      const userName = user ? user.name : "Offline Transaction";
      const adminName = admin ? admin.name : "-";
      const dateKey = dayjs(transaction.createdAt).format("DD/MM/YYYY");

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }

      acc[dateKey].push({
        ...transaction,
        userName,
        adminName,
      });

      return acc;
    }, {});

    // Sort by date (newest first)
    const sortedGrouped = Object.fromEntries(
      Object.entries(grouped).sort((a, b) => {
        const dateA = dayjs(a[0], "DD/MM/YYYY");
        const dateB = dayjs(b[0], "DD/MM/YYYY");
        return dateB - dateA;
      })
    );

    setGroupedData(sortedGrouped);
    setCurrentPage(1); // Reset to first page when data changes
  };

  const getDateRangeHeader = (transactions) => {
    const dates = [...new Set(transactions.map(t => dayjs(t.createdAt).format("DD/MM/YYYY")))]; 
    dates.sort();

    if (dates.length === 1) {
      return dates[0];
    } else if (dates.length > 1) {
      return `${dates[0]} - ${dates[dates.length - 1]}`;
    }
    return "";
  };

  // Get paginated data
  const getPaginatedTransactions = () => {
    const allTransactions = Object.values(groupedData).flat();
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return allTransactions.slice(startIndex, endIndex);
  };

  const pageCount = Math.ceil(
    Object.values(groupedData).flat().length / ITEMS_PER_PAGE
  );

  const calculateGrandTotal = () => {
    return Object.values(groupedData).reduce((grandTotal, dateTransactions) => {
      const dateTotalTransaction = dateTransactions.reduce(
        (acc, transaction) => acc + transaction.total,
        0
      );
      return grandTotal + dateTotalTransaction;
    }, 0);
  };

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (transactions.length > 0 && users.length > 0) {
      groupTransactionsByDate();
    }
  }, [transactions, users]);

  const handleUpdateReport = () => {
    if (!startDate || !endDate) {
      groupTransactionsByDate();
      return;
    }

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = dayjs(transaction.createdAt);
      const start = startDate.startOf("day");
      const end = endDate.endOf("day");
      return transactionDate.isBetween(start, end, null, "[]");
    });

    groupTransactionsByDate(filteredTransactions);
  };

  const handleReset = async () => {
    setStartDate(null);
    setEndDate(null);
    await fetchTransactions();
    groupTransactionsByDate();
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleDownloadPDF = () => {
    const input = previewRef.current;

    const startDateText = startDate
      ? dayjs(startDate).format("DD/MM/YYYY")
      : "All Data";
    const endDateText = endDate
      ? dayjs(endDate).format("DD/MM/YYYY")
      : "All Data";
    const periodText =
      startDate || endDate
        ? `Period: ${startDateText} - ${endDateText}`
        : "Period: All Data";

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const margins = 20;
        let yPosition = margins + 15;

        try {
          const logoWidth = 20;
          const logoHeight = 20;
          pdf.addImage('/image/Ngagel97Logo.png', 'PNG', margins, margins, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error adding logo:', error);
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(16);
        pdf.text("Ngagel97 Print Shop", 105, yPosition, { align: "center" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.text(
          "Jl. Ngagel Jaya Tengah No.69, Baratajaya, Kec. Gubeng, Surabaya, Jawa Timur 60284",
          105,
          yPosition + 7,
          { align: "center" }
        );
        pdf.text("Contact Number: (031) 5027852", 105, yPosition + 13, { align: "center" });

        pdf.setFontSize(14);
        pdf.text("Sales Report", 105, yPosition + 23, { align: "center" });

        pdf.setFontSize(12);
        pdf.text(periodText, 105, yPosition + 30, { align: "center" });

        pdf.addImage(imgData, "PNG", 0, yPosition + 40, imgWidth, imgHeight);

        let heightLeft = imgHeight - pageHeight + yPosition + 40;
        while (heightLeft > 0) {
          yPosition -= pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, yPosition + 40, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("sales-report.pdf");
      })
      .catch((err) => console.error("Error generating PDF:", err));
  };

  const renderTransactionTable = () => {
    const paginatedTransactions = getPaginatedTransactions();
    const dateRangeHeader = getDateRangeHeader(paginatedTransactions);
    const totalTransaction = paginatedTransactions.reduce(
      (acc, transaction) => acc + transaction.total,
      0
    );

    return (
      <div>
        <Typography variant="h6" gutterBottom>
          Date: {dateRangeHeader}
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Admin Name</TableCell>
                <TableCell>Shipping</TableCell>
                <TableCell>Subtotal</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{transaction.idTransaksi}</TableCell>
                  <TableCell>{transaction.userName}</TableCell>
                  <TableCell>{transaction.adminName}</TableCell>
                  <TableCell>{formatCurrency(transaction.ongkir)}</TableCell>
                  <TableCell>{formatCurrency(transaction.subtotal)}</TableCell>
                  <TableCell>{formatCurrency(transaction.total)}</TableCell>
                </TableRow>
              ))}
              <TableRow sx={{ bgcolor: "#f1f1f1" }}>
                <TableCell colSpan={5} align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>{formatCurrency(totalTransaction)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ minHeight: "100vh", padding: "20px" }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              bgcolor: "#b08968",
              p: 2,
              borderRadius: "4px 4px 0 0",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Sales Report
            </Typography>
          </Box>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} error={!isDateRangeValid()} />
                )}
                format="DD/MM/YYYY"
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} error={!isDateRangeValid()} />
                )}
                format="DD/MM/YYYY"
              />
              <Button
                variant="contained"
                sx={{ bgcolor: "#b08968", color: "white" }}
                onClick={handleUpdateReport}
                disabled={!isDateRangeValid()}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#C50102", color: "white" }}
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "#1976D2", color: "white" }}
                onClick={() => setOpenPreview(true)}
              >
                Preview & Download PDF
              </Button>
            </Box>
            {!isDateRangeValid() && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                The Start Date cannot be later than the End Date.
              </Typography>
            )}
          </Paper>
          <Paper sx={{ p: 3 }}>
            {renderTransactionTable()}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 2 }}>
              <Pagination
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Typography variant="h6">
                <strong>
                  Grand Total: {formatCurrency(calculateGrandTotal())}
                </strong>
              </Typography>
            </Box>
          </Paper>
        </Container>

        <Dialog
          open={openPreview}
          onClose={() => setOpenPreview(false)}
          fullWidth
          maxWidth="lg"
        >
          <DialogTitle>Preview PDF</DialogTitle>
          <DialogContent>
            <Box
              sx={{ width: "100%", bgcolor: "white", p: 2 }}
              ref={previewRef}
            >
              {renderTransactionTable()}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Typography variant="h6">
                  <strong>
                    Grand Total: {formatCurrency(calculateGrandTotal())}
                  </strong>
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPreview(false)}>Close</Button>
            <Button variant="contained" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
};

export default SalesPage;
