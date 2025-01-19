import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  FaFileDownload,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaCreditCard,
  FaEye,
  FaHistory,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "../dialog";
import { Button } from "../button";
import { Label } from "../label";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import {
  fetchInvoicesAsync,
  updatePaymentStatusAsync,
  resendInvoiceEmailAsync,
  deleteInvoiceAsync,
  selectInvoices,
  selectInvoiceStatus,
  setFilters,
} from "features/invoices/invoiceSlice";
import { format } from "date-fns";

const StatusRenderer = (props) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partially paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'void':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`px-2 py-1 rounded-full text-center ${getStatusColor(props.value)}`}>
      {props.value}
    </div>
  );
};

const PaymentStatusRenderer = (props) => {
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();

  const handleUpdatePayment = async (status) => {
    try {
      const installment = props.data.payment.installments[0];
      await dispatch(updatePaymentStatusAsync({
        id: props.data._id,
        installmentId: installment._id,
        paymentData: {
          status,
          paidAmount: installment.amount,
          paymentMethod: props.data.payment.method,
          reference: `PAY-${Date.now()}`,
        },
      })).unwrap();
      toast.success("Payment status updated successfully");
      setShowDialog(false);
    } catch (error) {
      toast.error("Failed to update payment status");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDialog(true)}
        className="text-blue-600 hover:text-blue-800"
      >
        <FaCreditCard className="mr-2 h-4 w-4" />
        Update Payment
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Payment Status</DialogTitle>
            <DialogDescription>
              Select the new payment status for this invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Payment Status</Label>
              <Select onValueChange={handleUpdatePayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const ActionRenderer = (props) => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const dispatch = useDispatch();

  const handleAction = async (action) => {
    switch (action) {
      case "view":
        setDialogType("view");
        setShowDialog(true);
        break;
      case "email":
        try {
          await dispatch(resendInvoiceEmailAsync(props.data._id)).unwrap();
          toast.success("Invoice email sent successfully");
        } catch (error) {
          toast.error("Failed to send invoice email");
        }
        break;
      case "delete":
        if (window.confirm("Are you sure you want to delete this invoice?")) {
          try {
            await dispatch(deleteInvoiceAsync(props.data._id)).unwrap();
            toast.success("Invoice deleted successfully");
          } catch (error) {
            toast.error("Failed to delete invoice");
          }
        }
        break;
      default:
        break;
    }
  };

  const handleDownloadPDF = useCallback(() => {
    const doc = new jsPDF();
    
    // Add company header
    doc.setFontSize(20);
    doc.text("Finclutech Automobile", 105, 15, { align: "center" });
    doc.setFontSize(16);
    doc.text("INVOICE", 105, 25, { align: "center" });
    
    // Add invoice details
    doc.setFontSize(10);
    doc.text(`Invoice Number: ${props.data.invoiceNumber}`, 14, 40);
    doc.text(`Date: ${format(new Date(props.data.date), "dd MMM yyyy")}`, 14, 45);
    doc.text(`Due Date: ${format(new Date(props.data.dueDate), "dd MMM yyyy")}`, 14, 50);
    
    // Add customer details
    doc.text("Bill To:", 14, 60);
    doc.text(props.data.customer.name, 14, 65);
    doc.text(props.data.customer.address, 14, 70);
    doc.text(`Email: ${props.data.customer.email}`, 14, 75);
    doc.text(`Phone: ${props.data.customer.phone}`, 14, 80);
    
    // Add vehicle details
    doc.text("Vehicle Details:", 14, 90);
    doc.text(`${props.data.vehicleInfo.year} ${props.data.vehicleInfo.make} ${props.data.vehicleInfo.model}`, 14, 95);
    doc.text(`VIN: ${props.data.vehicleInfo.vin}`, 14, 100);
    
    // Add items table
    const tableColumn = ["Description", "Part Number", "Qty", "Unit Price", "Discount", "Total"];
    const tableRows = props.data.items.map((item) => [
      item.description,
      item.partNumber,
      item.quantity,
      `$${item.unitPrice.toFixed(2)}`,
      `${item.discount}%`,
      `$${item.subtotal.toFixed(2)}`,
    ]);

    doc.autoTable({
      startY: 110,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [31, 41, 55] },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // Add totals
    doc.text(`Subtotal: $${props.data.pricing.subtotal.toFixed(2)}`, 140, finalY + 10);
    doc.text(`Tax (${props.data.pricing.taxRate}%): $${props.data.pricing.taxAmount.toFixed(2)}`, 140, finalY + 15);
    doc.text(`Total: $${props.data.pricing.totalAmount.toFixed(2)}`, 140, finalY + 20);

    // Add payment details
    doc.text("Payment Details:", 14, finalY + 35);
    doc.text(`Method: ${props.data.payment.method}`, 14, finalY + 40);
    doc.text(`Terms: ${props.data.payment.terms}`, 14, finalY + 45);

    // Add footer
    doc.text("Thank you for your business!", 105, finalY + 60, { align: "center" });

    doc.save(`invoice-${props.data.invoiceNumber}.pdf`);
  }, [props.data]);

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleAction("view")}
        className="text-blue-600 hover:text-blue-800"
        title="View Details"
      >
        <FaEye className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownloadPDF}
        className="text-green-600 hover:text-green-800"
        title="Download PDF"
      >
        <FaFileDownload className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleAction("email")}
        className="text-purple-600 hover:text-purple-800"
        title="Send Email"
      >
        <FaEnvelope className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => handleAction("delete")}
        className="text-red-600 hover:text-red-800"
        title="Delete"
        disabled={props.data.status === "Paid"}
      >
        <FaTrash className="h-4 w-4" />
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {dialogType === "view" && props.data && (
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Number</Label>
                  <div className="mt-1 font-medium">{props.data.invoiceNumber}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <StatusRenderer value={props.data.status} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <div className="mt-1 font-medium">{props.data.customer.name}</div>
                  <div className="text-sm text-gray-500">{props.data.customer.email}</div>
                  <div className="text-sm text-gray-500">{props.data.customer.phone}</div>
                </div>
                <div>
                  <Label>Vehicle</Label>
                  <div className="mt-1 font-medium">
                    {props.data.vehicleInfo.year} {props.data.vehicleInfo.make} {props.data.vehicleInfo.model}
                  </div>
                  <div className="text-sm text-gray-500">VIN: {props.data.vehicleInfo.vin}</div>
                </div>
              </div>

              <div>
                <Label>Items</Label>
                <div className="mt-2 border rounded-lg divide-y">
                  {props.data.items.map((item, index) => (
                    <div key={index} className="p-3">
                      <div className="flex justify-between">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-right">
                          <div>${item.subtotal.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">
                            {item.quantity} x ${item.unitPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Payment Details</Label>
                  <div className="mt-1">
                    <div>Method: {props.data.payment.method}</div>
                    <div>Terms: {props.data.payment.terms}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div>Subtotal: ${props.data.pricing.subtotal.toFixed(2)}</div>
                    <div>Tax ({props.data.pricing.taxRate}%): ${props.data.pricing.taxAmount.toFixed(2)}</div>
                    <div className="text-lg font-bold">
                      Total: ${props.data.pricing.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const InvoiceGridTable = () => {
  const gridRef = useRef();
  const dispatch = useDispatch();
  const invoices = useSelector(selectInvoices);
  console.log(invoices)
  const status = useSelector(selectInvoiceStatus);
  const [filterModel, setFilterModel] = useState({
    status: "",
    dateRange: null,
    customerEmail: "",
    minAmount: "",
    maxAmount: "",
  });

  const containerStyle = useMemo(() => ({ width: "100%", height: "70vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const [columnDefs] = useState([
    {
      field: "invoiceNumber",
      headerName: "Invoice #",
      filter: "agTextColumnFilter",
      width: 130,
    },
    // {
    //   field: "date",
    //   headerName: "Date",
    //   filter: "agDateColumnFilter",
    //   valueFormatter: (params) => format(new Date(params.value), "dd MMM yyyy"),
    //   width: 120,
    // },
    {
      field: "customer.name",
      headerName: "Customer",
      filter: "agTextColumnFilter",
    },
    {
      field: "vehicleInfo.make",
      headerName: "Vehicle",
      valueFormatter: (params) => 
        `${params.data.vehicleInfo.year} ${params.data.vehicleInfo.make} ${params.data.vehicleInfo.model}`,
    },
    {
      field: "pricing.totalAmount",
      headerName: "Amount",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      cellClass: "font-semibold text-right",
    },
    {
      field: "status",
      headerName: "Status",
      filter: "agTextColumnFilter",
      cellRenderer: StatusRenderer,
      width: 120,
    },
    {
      field: "payment",
      headerName: "Payment",
      cellRenderer: PaymentStatusRenderer,
      sortable: false,
      filter: false,
      width: 150,
    },
    {
      headerName: "Actions",
      cellRenderer: ActionRenderer,
      sortable: false,
      filter: false,
      width: 200,
    },
  ]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  }), []);

  useEffect(() => {
    dispatch(fetchInvoicesAsync(filterModel));
  }, [dispatch, filterModel]);

  const handleFilterChange = (field, value) => {
    setFilterModel(prev => ({
      ...prev,
      [field]: value
    }));
    dispatch(setFilters({ [field]: value }));
  };

  const handleExportSelected = useCallback(() => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select invoices to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Finclutech Automobile - Invoices Report", 105, 15, { align: "center" });
    
    doc.autoTable({
      head: [["Invoice #", "Date", "Customer", "Amount", "Status"]],
      body: selectedRows.map(row => [
        row.invoiceNumber,
        format(new Date(row.date), "dd MMM yyyy"),
        row.customer.name,
        `$${row.pricing.totalAmount.toFixed(2)}`,
        row.status
      ]),
      startY: 25,
      theme: "grid",
      headStyles: { fillColor: [31, 41, 55] }
    });

    doc.save("invoices-report.pdf");
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Invoices</h2>
        <div className="flex gap-2">
          <Button onClick={handleExportSelected}>
            Export Selected
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <Label>Status Filter</Label>
          <Select
            value={filterModel.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {/* <SelectItem value="">All</SelectItem> */}
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Sent">Sent</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Customer Email</Label>
          <Input
            type="email"
            value={filterModel.customerEmail}
            onChange={(e) => handleFilterChange("customerEmail", e.target.value)}
            placeholder="Filter by email"
          />
        </div>

        <div>
          <Label>Min Amount</Label>
          <Input
            type="number"
            value={filterModel.minAmount}
            onChange={(e) => handleFilterChange("minAmount", e.target.value)}
            placeholder="Min amount"
          />
        </div>

        <div>
          <Label>Max Amount</Label>
          <Input
            type="number"
            value={filterModel.maxAmount}
            onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
            placeholder="Max amount"
          />
        </div>
      </div>

      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-quartz">
          <AgGridReact
            ref={gridRef}
            rowData={invoices}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={15}
            rowSelection="multiple"
            enableCellTextSelection={true}
            rowHeight={48}
            loadingOverlayComponent={() => "Loading..."}
            loadingOverlayComponentParams={{
              loadingMessage: "One moment please...",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceGridTable;
