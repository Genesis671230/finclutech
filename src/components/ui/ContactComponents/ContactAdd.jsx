import * as React from "react";
// import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Form, useFormik } from "formik";
import { getApi, putApi } from "services/api";
import { cn } from "lib/utils.ts";
import { useState, useEffect } from "react";
import { postApi } from "services/api";
import * as Yup from "yup";
import { Button } from "../button.jsx";
import { Calendar } from "../calendar.jsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer.jsx";
import { Input } from "../input.jsx";
import { Label } from "../label.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../popover.jsx";
import { Switch } from "../switch.jsx";
import {
  modalClosed,
  modalData,
} from "../../../redux/slices/editModalSlice/editModalSlice.js";
import { modalOpened } from "../../../redux/slices/editModalSlice/editModalSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { BiPlus } from "react-icons/bi";
import { CloseIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";
// import { selectDeals } from "features/deals/dealSlice";
import { toast } from "react-toastify";
import { selectLeads } from "features/Leads/leadSlice";

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
      const formattedDate = format(date, "yyyy-MM-dd"); // Use ISO format for consistency
      setCurrentDate(date);
      onDateChange(formattedDate);
    },
    [onDateChange]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (currentDate) {
        handleDateChange(currentDate);
      }
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !currentDate && "text-muted-foreground"
          )}
          onKeyDown={handleKeyDown}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {currentDate ? format(currentDate, "PP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          className="whitespace-nowrap"
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

// const DatePicker = React.memo((props) => {
//   const { name, value, onDateChange } = props;
//   const [currentDate, setCurrentDate] = useState(value);

//   const handleDateChange = React.useCallback(
//     (date) => {
//       onDateChange(format(date, "PP"));
//       setCurrentDate(date);
//     },
//     [onDateChange]
//   );

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           className={cn(
//             "w-[240px] justify-start text-left font-normal",
//             !currentDate && "text-muted-foreground"
//           )}
//         >
//           <CalendarIcon className="mr-2 h-4 w-4" />
//           {currentDate ? format(currentDate, "PP") : <span>Pick a date</span>}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           className="whitespace-nowrap "
//           fromYear={2015}
//           toYear={2025}
//           name={name}
//           mode="single"
//           selected={currentDate}
//           onSelect={handleDateChange}
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// });

function ProfileForm({ className }) {
  const [isLoding, setIsLoding] = React.useState(false);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const leads = useSelector(selectLeads);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getApi("api/user/");
        if (response.status === 200) {
          setUsers(response.data.user);
          console.log(response.data.user, "users's data is here ");
        }
      } catch (error) {
        console.error("Failed to fetch deals", error);
      }
    };

    fetchUsers();
  }, []);

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
      AddData();
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

  const AddData = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/invoices/", values);
      if (response.status === 200) {
        toast.success("Data Submitted Successfully");

        handleCancel();
      }
    } catch (e) {
      console.log(e);

      toast.warning("Data not added ");
    } finally {
      setIsLoding(false);
    }
  };

  const handleCancel = () => {
    formik.resetForm();
    dispatch(modalClosed());
  };

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
          className={cn(errors.title && touched.title ? "border-red-300" : null)}
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
          className={cn(errors.email && touched.email ? "border-red-300" : null)}
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

function ContactAdd() {
  const dispatch = useDispatch();
  const { isOpen } = useSelector(modalData);

  const handleClose = () => {
    dispatch(modalClosed());
  };
  const handleOpen = () => {
    dispatch(modalOpened());
  };

  return (
    <Drawer open={isOpen} direction="right" className="overflow-scroll">
      <DrawerOverlay onClick={handleClose} />
      <DrawerTrigger asChild>
        <Button
          onClick={handleOpen}
          variant="outline"
          className="bg-blue-700 text-white"
        >
          <BiPlus /> Add Contact
        </Button>
      </DrawerTrigger>
      <DrawerContent className="right-0 z-50 left-auto h-full w-[45rem] overflow-auto">
        <div className="mx-auto w-full">
          <IconButton
            className="float-end"
            onClick={handleClose}
            icon={<CloseIcon />}
          />
          <DrawerHeader className="text-left">
            <DrawerTitle>Edit Contact</DrawerTitle>
            <DrawerDescription>
              Setup an Invoice. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
          <ProfileForm className="px-4" />
          {/* <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button onClick={handleClose} variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter> */}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ContactAdd;
