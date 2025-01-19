import { EditIcon } from "@chakra-ui/icons";
import { ChevronDownIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";

import { Checkbox } from "@chakra-ui/react";
import { Button } from "../button.jsx";
import { Input } from "../input.jsx";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu.jsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table.jsx";

import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { DownloadIcon } from "@chakra-ui/icons";

var checkboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};
var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};


export const generatePDF = (salesOrder) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Add branded header
  doc.setFillColor(0, 123, 255); // Set your brand color (e.g., blue)
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Add company logo
  doc.addImage(logoUrl, 'PNG', 10, 5, 30, 30);

  // Add company name
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Your Company Name", pageWidth - 10, 25, { align: "right" });

  // Add "Sales Order" title
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(28);
  doc.text("Sales Order", pageWidth / 2, 60, { align: "center" });

  // Add order details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Order Number: ${salesOrder.orderNumber}`, 20, 80);
  doc.text(`Customer: ${salesOrder.customerName}`, 20, 90);
  doc.text(`Order Date: ${salesOrder.orderDate}`, pageWidth - 20, 80, { align: "right" });
  doc.text(`Delivery Date: ${salesOrder.deliveryDate}`, pageWidth - 20, 90, { align: "right" });

  // Prepare product details
  const productRows = salesOrder.products ? salesOrder.products : [];
  while (productRows.length < 10) {
    productRows.push({ vehicleModel: '', quantity: '', unitPrice: '', totalAmount: '' });
  }

  // Add product details table
  doc.autoTable({
    startY: 100,
    head: [["Vehicle Model", "Quantity", "Unit Price", "Total Amount"]],
    body: productRows.map(product => [
      product.vehicleModel,
      product.quantity,
      product.unitPrice ? `$${Number(product.unitPrice).toLocaleString()}` : '',
      product.totalAmount ? `$${Number(product.totalAmount).toLocaleString()}` : ''
    ]),
    styles: { cellPadding: 3, fontSize: 10 },
    headStyles: { fillColor: [0, 123, 255], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  // Add additional details
  const startY = doc.lastAutoTable.finalY + 15;
  doc.setDrawColor(0, 123, 255);
  doc.setLineWidth(0.5);
  doc.line(20, startY, pageWidth - 20, startY);

  doc.setFontSize(11);
  doc.text(`Status: ${salesOrder.status}`, 20, startY + 10);
  doc.text(`Payment Method: ${salesOrder.paymentMethod}`, 20, startY + 20);
  doc.text(`Sales Person: ${salesOrder.salesPerson}`, 20, startY + 30);

  // Add total amount
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`Total Order Amount: $${Number(salesOrder.totalOrderAmount).toLocaleString()}`, pageWidth - 20, startY + 20, { align: "right" });

  // Add notes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Notes:", 20, startY + 45);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(salesOrder.notes, 20, startY + 55, { maxWidth: pageWidth - 40 });

  // Add footer
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Thank you for your business!", pageWidth / 2, pageHeight - 20, { align: "center" });
  doc.text("Page 1 of 1", pageWidth / 2, pageHeight - 10, { align: "center" });

  // Save the PDF
  doc.save(`SalesOrder_${salesOrder.orderNumber}.pdf`);
};


export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table?.getIsAllPageRowsSelected() ||
          (table?.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table?.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row?.getIsSelected()}
          onCheckedChange={(value) => row?.toggleSelected(!!value)}
          aria-label="Select row"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "dealId",
    header: "dealId",
    cell: ({ row }) => (
      <div className="capitalize">{row?.getValue("dealId")}</div>
    ),
  },
  {
    accessorKey: "_id",
    header: "_id",
    cell: ({ row }) => <div className="capitalize">{row?.getValue("_id")}</div>,
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: ({ row }) => (
      <div className="capitalize">{row?.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "commissionFromTenant",
    header: "Commission From Tenant",
    cell: ({ row }) => <div>{row?.getValue("commissionFromTenant")}</div>,
  },
  {
    accessorKey: "commissionFromDeveloper",
    header: "Commission From Developer",
    cell: ({ row }) => <div>{row?.getValue("commissionFromDeveloper")}</div>,
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
    cell: ({ row }) => <div>{row?.getValue("invoiceDate")}</div>,
  },

  {
    accessorKey: "totalVAT",
    header: "Total VAT",
    cell: ({ row }) => <div>{row?.getValue("totalVAT")}</div>,
  },
  {
    accessorKey: "totalCommission",
    header: "Total Commission",
    cell: ({ row }) => <div>{row?.getValue("totalCommission")}</div>,
  },

  {
    accessorKey: "vatOnOff",
    header: "Vat On Off",
    cell: ({ row }) => <div>{row?.getValue("vatOnOff")}</div>,
  },
  {
    id: "download",
    header: "Download",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row.original;
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => generateInvoicePDF(invoice)}
          aria-label="Download Invoice"
        >
          <DownloadIcon />
        </Button>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const invoice = row?.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => generateInvoicePDF(invoice)}
            >
              Download Invoice
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "edit",
    header: "Edit",
    enableHiding: false,
    header: ({ table }) => {
      return (
        <EditIcon
          onClick={() => {
            return;
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <EditIcon
          onClick={() => {
            return;
          }}
        />
      );
    },
  },
];

const generateInvoicePDF = (invoice) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;

  // Add header
  doc.setFontSize(20);
  doc.text("Invoice", pageWidth / 2, 20, { align: "center" });

  // Add invoice details
  doc.setFontSize(12);
  doc.text(`Invoice ID: ${invoice._id}`, 20, 40);
  doc.text(`Date: ${invoice.invoiceDate}`, 20, 50);
  doc.text(`User ID: ${invoice.userId}`, 20, 60);

  // Add products table
  const tableColumn = ["Product", "Quantity", "Price", "Total"];
  const tableRows = invoice.products.map(product => [
    product.name,
    product.quantity,
    `$${product.price.toFixed(2)}`,
    `$${(product.quantity * product.price).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 70,
    head: [tableColumn],
    body: tableRows,
  });

  // Add totals
  const finalY = doc.lastAutoTable.finalY || 70;
  doc.text(`Commission from Tenant: $${invoice.commissionFromTenant.toFixed(2)}`, 20, finalY + 20);
  doc.text(`Commission from Developer: $${invoice.commissionFromDeveloper.toFixed(2)}`, 20, finalY + 30);
  doc.text(`Total VAT: $${invoice.totalVAT.toFixed(2)}`, 20, finalY + 40);
  doc.text(`Total Commission: $${invoice.totalCommission.toFixed(2)}`, 20, finalY + 50);

  // Save the PDF
  doc.save(`Invoice_${invoice._id}.pdf`);
};


export function InvoicesTable({ invoicesList }) {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const [data, setData] = useState(invoicesList || []);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  console.log(table?.getFilteredSelectedRowModel());
  return (
    <div className="w-full ">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={table?.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(event) =>
            table?.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              ?.getAllColumns()
              .filter((column) => column?.getCanHide())
              ?.map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups()?.map((headerGroup) => (
              <TableRow key={headerGroup?.id}>
                {headerGroup?.headers?.map((header) => {
                  return (
                    <TableHead key={header?.id}>
                      {header?.isPlaceholder
                        ? null
                        : flexRender(
                            header?.column?.columnDef?.header,
                            header?.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel()?.rows?.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells()?.map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns?.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table?.getFilteredSelectedRowModel()?.rows?.length > 0 &&
            table?.getFilteredSelectedRowModel()?.rows?.length !== undefined &&
            table?.getFilteredSelectedRowModel()?.rows?.length}{" "}
          of{" "}
          {table?.getFilteredRowModel()?.rows?.length > 0 &&
            table?.getFilteredSelectedRowModel()?.rows?.length !== undefined &&
            table?.getFilteredRowModel()?.rows?.length}{" "}
          row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.previousPage()}
            disabled={!table?.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table?.nextPage()}
            disabled={!table?.getCanNextPage()}
          >
            Next
          </Button>

          <div className="h-2" />
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table?.setPageIndex(0)}
              disabled={!table?.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table?.previousPage()}
              disabled={!table?.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table?.nextPage()}
              disabled={!table?.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table?.setPageIndex(table?.getPageCount() - 1)}
              disabled={!table?.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table?.getState().pagination.pageIndex + 1} of{" "}
                {table?.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                defaultValue={table?.getState()?.pagination?.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>{table?.getRowModel()?.rows?.length} Rows</div>
        </div>
      </div>
    </div>
  );
}
