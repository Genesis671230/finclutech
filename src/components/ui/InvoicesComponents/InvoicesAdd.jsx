import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { CalendarIcon } from "@radix-ui/react-icons";
import { FaPlus, FaTrash } from "react-icons/fa";
import { createInvoiceAsync } from "features/invoices/invoiceSlice";
import { getApi } from "services/api";
import { cn } from "lib/utils.ts";

import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Textarea } from "../textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import { Calendar } from "../calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../card";

const invoiceSchema = Yup.object({
  customerName: Yup.string().required("Customer name is required"),
  customerEmail: Yup.string().email("Invalid email").required("Email is required"),
  customerPhone: Yup.string().required("Phone number is required"),
  customerAddress: Yup.string().required("Address is required"),
  vehicleInfo: Yup.object({
    make: Yup.string().required("Make is required"),
    model: Yup.string().required("Model is required"),
    year: Yup.number().required("Year is required"),
    vin: Yup.string().required("VIN is required"),
    mileage: Yup.number(),
  }),
  items: Yup.array().of(
    Yup.object({
      description: Yup.string().required("Description is required"),
      partNumber: Yup.string(),
      quantity: Yup.number().required("Quantity is required").min(1),
      unitPrice: Yup.number().required("Unit price is required").min(0),
      discount: Yup.number().min(0).max(100),
    })
  ).min(1, "At least one item is required"),
  payment: Yup.object({
    method: Yup.string().required("Payment method is required"),
    terms: Yup.string(),
  }),
  notes: Yup.object({
    external: Yup.string(),
    internal: Yup.string(),
  }),
});

const DatePickerField = ({ name, value, onChange, label }) => {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => onChange(name, date)}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

const InvoicesAdd = () => {
  const dispatch = useDispatch();
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSalesOrders = async () => {
      try {
        const response = await getApi("api/sales-orders");
        setSalesOrders(response.data.data);
      } catch (error) {
        console.error("Failed to fetch sales orders:", error);
        toast.error("Failed to fetch sales orders");
      }
    };
    fetchSalesOrders();
  }, []);

  const formik = useFormik({
    initialValues: {
      salesOrderId: "",
      date: new Date(),
      dueDate: new Date(),
      status: "Draft",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: "",
      customerTaxId: "",
      vehicleInfo: {
        make: "",
        model: "",
        year: "",
        vin: "",
        mileage: "",
        registrationNumber: "",
      },
      items: [
        {
          description: "",
          partNumber: "",
          quantity: 1,
          unitPrice: 0,
          discount: 0,
          tax: 0,
          subtotal: 0,
        },
      ],
      pricing: {
        subtotal: 0,
        taxRate: 5,
        taxAmount: 0,
        discount: {
          type: "Percentage",
          value: 0,
          amount: 0,
        },
        totalAmount: 0,
      },
      payment: {
        method: "",
        terms: "",
        installments: [
          {
            dueDate: new Date(),
            amount: 0,
            status: "Pending",
          },
        ],
      },
      warranty: {
        parts: "",
        labor: "",
        terms: "",
      },
      notes: {
        internal: "",
        external: "",
      },
    },
    // validationSchema: invoiceSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await dispatch(createInvoiceAsync(values)).unwrap();
        toast.success("Invoice created successfully");
        formik.resetForm();
      } catch (error) {
        toast.error(error.message || "Failed to create invoice");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleSalesOrderSelect = async (salesOrderId) => {
    if (!salesOrderId) return;

    try {
      const response = await getApi(`api/sales-orders/${salesOrderId}`);
      const salesOrder = response.data.data;

      formik.setValues({
        ...formik.values,
        salesOrderId,
        customerName: salesOrder.customerName,
        customerEmail: salesOrder.customerEmail,
        customerPhone: salesOrder.customerPhone,
        customerAddress: salesOrder.customerAddress,
        vehicleInfo: salesOrder.vehicleInfo,
        items: salesOrder.items.map(item => ({
          ...item,
          subtotal: item.quantity * item.unitPrice * (1 - item.discount/100),
        })),
        pricing: {
          ...salesOrder.pricing,
          discount: {
            type: "Percentage",
            value: 0,
            amount: 0,
          },
        },
      });
    } catch (error) {
      console.error("Failed to fetch sales order:", error);
      toast.error("Failed to fetch sales order details");
    }
  };

  const calculateTotals = () => {
    const items = formik.values.items;
    const subtotal = items.reduce((sum, item) => {
      const itemSubtotal = item.quantity * item.unitPrice * (1 - item.discount/100);
      return sum + itemSubtotal;
    }, 0);

    const taxAmount = subtotal * (formik.values.pricing.taxRate / 100);
    const discountAmount = formik.values.pricing.discount.type === "Percentage"
      ? subtotal * (formik.values.pricing.discount.value / 100)
      : formik.values.pricing.discount.value;

    formik.setFieldValue("pricing.subtotal", subtotal);
    formik.setFieldValue("pricing.taxAmount", taxAmount);
    formik.setFieldValue("pricing.discount.amount", discountAmount);
    formik.setFieldValue("pricing.totalAmount", subtotal + taxAmount - discountAmount);
  };

  useEffect(() => {
    calculateTotals();
  }, [formik.values.items, formik.values.pricing.taxRate, formik.values.pricing.discount]);

  const addItem = () => {
    formik.setFieldValue("items", [
      ...formik.values.items,
      {
        description: "",
        partNumber: "",
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        tax: 0,
        subtotal: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = formik.values.items.filter((_, i) => i !== index);
    formik.setFieldValue("items", newItems);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Invoice</CardTitle>
          <CardDescription>
            Create a new invoice by filling out the form below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Sales Order Selection */}
            <div className="grid gap-2">
              <Label>Select Sales Order (Optional)</Label>
              <Select
                value={formik.values.salesOrderId}
                onValueChange={handleSalesOrderSelect}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a sales order" />
                </SelectTrigger>
                <SelectContent>
                  {salesOrders&&salesOrders?.map((order) => (
                    <SelectItem key={order._id} value={order._id}>
                      {order.orderNumber} - {order.customerName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <DatePickerField
                name="date"
                label="Invoice Date"
                value={formik.values.date}
                onChange={formik.setFieldValue}
              />
              <DatePickerField
                name="dueDate"
                label="Due Date"
                value={formik.values.dueDate}
                onChange={formik.setFieldValue}
              />
            </div>

            {/* Customer Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Customer Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Name</Label>
                  <Input
                    name="customerName"
                    value={formik.values.customerName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customerName && formik.errors.customerName}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    name="customerEmail"
                    type="email"
                    value={formik.values.customerEmail}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customerEmail && formik.errors.customerEmail}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Phone</Label>
                  <Input
                    name="customerPhone"
                    value={formik.values.customerPhone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.customerPhone && formik.errors.customerPhone}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tax ID (Optional)</Label>
                  <Input
                    name="customerTaxId"
                    value={formik.values.customerTaxId}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Address</Label>
                <Textarea
                  name="customerAddress"
                  value={formik.values.customerAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.customerAddress && formik.errors.customerAddress}
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Vehicle Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Make</Label>
                  <Input
                    name="vehicleInfo.make"
                    value={formik.values.vehicleInfo.make}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.vehicleInfo?.make && 
                      formik.errors.vehicleInfo?.make
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Model</Label>
                  <Input
                    name="vehicleInfo.model"
                    value={formik.values.vehicleInfo.model}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.vehicleInfo?.model && 
                      formik.errors.vehicleInfo?.model
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Year</Label>
                  <Input
                    name="vehicleInfo.year"
                    type="number"
                    value={formik.values.vehicleInfo.year}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.vehicleInfo?.year && 
                      formik.errors.vehicleInfo?.year
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>VIN</Label>
                  <Input
                    name="vehicleInfo.vin"
                    value={formik.values.vehicleInfo.vin}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.vehicleInfo?.vin && 
                      formik.errors.vehicleInfo?.vin
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Mileage</Label>
                  <Input
                    name="vehicleInfo.mileage"
                    type="number"
                    value={formik.values.vehicleInfo.mileage}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Registration Number</Label>
                  <Input
                    name="vehicleInfo.registrationNumber"
                    value={formik.values.vehicleInfo.registrationNumber}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Items</h3>
                <Button type="button" onClick={addItem} variant="outline">
                  <FaPlus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
              <div className="space-y-4">
                {formik.values.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 items-end">
                    <div className="col-span-2">
                      <Label>Description</Label>
                      <Input
                        name={`items.${index}.description`}
                        value={item.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.items?.[index]?.description &&
                          formik.errors.items?.[index]?.description
                        }
                      />
                    </div>
                    <div>
                      <Label>Part Number</Label>
                      <Input
                        name={`items.${index}.partNumber`}
                        value={item.partNumber}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        name={`items.${index}.quantity`}
                        type="number"
                        value={item.quantity}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.items?.[index]?.quantity &&
                          formik.errors.items?.[index]?.quantity
                        }
                      />
                    </div>
                    <div>
                      <Label>Unit Price</Label>
                      <Input
                        name={`items.${index}.unitPrice`}
                        type="number"
                        value={item.unitPrice}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.items?.[index]?.unitPrice &&
                          formik.errors.items?.[index]?.unitPrice
                        }
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Discount %</Label>
                        <Input
                          name={`items.${index}.discount`}
                          type="number"
                          value={item.discount}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={formik.values.items.length === 1}
                      >
                        <FaTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Payment Method</Label>
                  <Select
                    name="payment.method"
                    value={formik.values.payment.method}
                    onValueChange={(value) => 
                      formik.setFieldValue("payment.method", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                      <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Financing">Financing</SelectItem>
                      <SelectItem value="Multiple">Multiple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Payment Terms</Label>
                  <Input
                    name="payment.terms"
                    value={formik.values.payment.terms}
                    onChange={formik.handleChange}
                    placeholder="e.g., Net 30"
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Pricing</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Tax Rate (%)</Label>
                  <Input
                    name="pricing.taxRate"
                    type="number"
                    value={formik.values.pricing.taxRate}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={formik.values.pricing.discount.type}
                    onValueChange={(value) =>
                      formik.setFieldValue("pricing.discount.type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>
                    Discount Value 
                    {formik.values.pricing.discount.type === "Percentage" ? " (%)" : ""}
                  </Label>
                  <Input
                    name="pricing.discount.value"
                    type="number"
                    value={formik.values.pricing.discount.value}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="text-right space-y-2">
                  <div>Subtotal:</div>
                  <div>Tax Amount:</div>
                  <div>Discount:</div>
                  <div className="font-bold">Total Amount:</div>
                </div>
                <div className="space-y-2">
                  <div>${formik.values.pricing.subtotal.toFixed(2)}</div>
                  <div>${formik.values.pricing.taxAmount.toFixed(2)}</div>
                  <div>${formik.values.pricing.discount.amount.toFixed(2)}</div>
                  <div className="font-bold">
                    ${formik.values.pricing.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Warranty Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Parts Warranty</Label>
                  <Input
                    name="warranty.parts"
                    value={formik.values.warranty.parts}
                    onChange={formik.handleChange}
                    placeholder="e.g., 12 months"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Labor Warranty</Label>
                  <Input
                    name="warranty.labor"
                    value={formik.values.warranty.labor}
                    onChange={formik.handleChange}
                    placeholder="e.g., 6 months"
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Warranty Terms</Label>
                  <Input
                    name="warranty.terms"
                    value={formik.values.warranty.terms}
                    onChange={formik.handleChange}
                    placeholder="Additional warranty terms"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="grid gap-4">
              <h3 className="text-lg font-semibold">Notes</h3>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>External Notes (Visible to Customer)</Label>
                  <Textarea
                    name="notes.external"
                    value={formik.values.notes.external}
                    onChange={formik.handleChange}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Internal Notes</Label>
                  <Textarea
                    name="notes.internal"
                    value={formik.values.notes.internal}
                    onChange={formik.handleChange}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => formik.resetForm()}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={loading || !formik.isValid}
        >
          {loading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
};

export default InvoicesAdd;
