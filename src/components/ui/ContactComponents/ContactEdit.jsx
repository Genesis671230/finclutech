import React, { useEffect, useState } from "react";
// import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormik } from "formik";
import { cn } from "lib/utils.ts";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApi, putApi } from "services/api";
import * as Yup from "yup";
import { modalClosed } from "../../../redux/slices/editModalSlice/editModalSlice.js";
import { Button } from "../button.jsx";
import { Calendar } from "../calendar.jsx";
import { DrawerClose, DrawerFooter } from "../drawer.jsx";
import { Input } from "../input.jsx";
import { Label } from "../label.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../popover.jsx";
// import { Bar, BarChart, ResponsiveContainer } from "recharts"


const revenueSchema = Yup.object({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const DatePicker = React.memo((props) => {
  const { name, value, onDateChange } = props;
  const [currentDate, setCurrentDate] = useState(value);

  const handleDateChange = React.useCallback(
    (date) => {
      onDateChange(format(date, "PP"));
      setCurrentDate(date);
    },
    [onDateChange]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !currentDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentDate ? format(currentDate, "PP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="whitespace-nowrap "
          fromYear={2015}
          toYear={2025}
          name={name}
          mode="single"
          selected={currentDate}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});

function LeadEdit({ className, dealRowData, setIsModalOpen }) {
  const [isLoding, setIsLoding] = React.useState(false);
  const dispatch = useDispatch();

  const initialValues = {
    title: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    physicalAddress: "",
    mailingAddress: "",
    preferredContactMethod: "",
    createBy: JSON.parse(localStorage.getItem("user"))._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: contactSchema,
    onSubmit: (values, { resetForm }) => {
      ContactEdit();
      resetForm();
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = formik;

  console.log(values);

  const ContactEdit = async () => {
    try {
      setIsLoding(true);
      let response = await putApi(
        `api/contacts/edit/${dealRowData._id}`,
        values
      );
      if (response.status === 200) {
        toast.success("Data Edited Successfully");
        handleCancel();
      }
    } catch (e) {
      console.log(e);
      toast.warning("Data not added ");
    } finally {
      setIsLoding(false);
    }
  };

  const handleUnselectImage = (pathToRemove) => {
    //   console.log(formik.initialValues.tenancyContract, "this is picture")

    const updatedContract = formik.values.tenancyContract.filter(
      (item) => item.path !== pathToRemove
    );

    formik.setFieldValue("tenancyContract", updatedContract);
  };

  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/api/user/agents")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAgents(data);
      })
      .catch((error) => {
        console.error("Error fetching agents:", error);
      });
  }, []);

  const handleCancel = () => {
    formik.resetForm();
    setIsModalOpen(false);
    dispatch(modalClosed());
  };

  const [dropdownData, setDropdownData] = useState({
    owners: [],
    locations: [],
    subLocations: [],
    projects: [],
  });
  const fetchDropdownData = async () => {
    //create a function to fetch owners data from the backend
    const result = await getApi("api/dropdowns/propertyForm/");
    console.log(result.data);
    setDropdownData(result.data);
  };
  useEffect(() => {
    fetchDropdownData();
  }, []);

  return (
    <form className={cn("grid  items-start gap-4 overflow-auto", className)}>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.title}
          type="text"
          name="title"
          id="title"
          placeholder="Enter title"
          className={cn(
            errors.title && touched.title ? "border-red-300" : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="firstName">First Name</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.firstName}
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Enter first name"
          className={cn(
            errors.firstName && touched.firstName ? "border-red-300" : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="lastName">Last Name</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.lastName}
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Enter last name"
          className={cn(
            errors.lastName && touched.lastName ? "border-red-300" : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.phoneNumber}
          type="text"
          name="phoneNumber"
          id="phoneNumber"
          placeholder="Enter phone number"
          className={cn(
            errors.phoneNumber && touched.phoneNumber ? "border-red-300" : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
          type="text"
          name="email"
          id="email"
          placeholder="Enter email"
          className={cn(
            errors.email && touched.email ? "border-red-300" : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="physicalAddress">Physical Address</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.physicalAddress}
          type="text"
          name="physicalAddress"
          id="physicalAddress"
          placeholder="Enter physical address"
          className={cn(
            errors.physicalAddress && touched.physicalAddress
              ? "border-red-300"
              : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="mailingAddress">Mailing Address</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.mailingAddress}
          type="text"
          name="mailingAddress"
          id="mailingAddress"
          placeholder="Enter mailing address"
          className={cn(
            errors.mailingAddress && touched.mailingAddress
              ? "border-red-300"
              : null
          )}
        />
      </div>
      <div className="grid border-[1px] p-2  gap-2">
        <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
        <Input
          fontSize="sm"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.preferredContactMethod}
          type="text"
          name="preferredContactMethod"
          id="preferredContactMethod"
          placeholder="Enter preferred contact method"
          className={cn(
            errors.preferredContactMethod && touched.preferredContactMethod
              ? "border-red-300"
              : null
          )}
        />
      </div>

      <DrawerFooter className="pt-2">
        <DrawerClose asChild>
          <Button onClick={handleSubmit} type="submit">
            Save changes
          </Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </form>
  );
}

export default LeadEdit;
