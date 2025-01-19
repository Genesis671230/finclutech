import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormik } from "formik";
import { cn } from "lib/utils.ts";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { putApi } from "services/api";
import * as Yup from "yup";
import { modalClosed, modalData, modalOpened } from "../../../redux/slices/editModalSlice/editModalSlice.js";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerTitle, DrawerTrigger } from "../drawer";
import { Input } from "../input";
import { Label } from "../label";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Checkbox } from "../checkbox.jsx";
import Dropzone from "components/Dropzone";
import { BiPlus } from "react-icons/bi";
import { IconButton } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { createUser } from "../../../features/users/userSlice";

const userSchema = Yup.object({
  employeeId: Yup.string()
    .required("Employee ID is required")
    .min(3, "Employee ID must be at least 3 characters"),
  firstName: Yup.string()
    .required("First Name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string()
    .required("Role is required"),
  
});

function UsersAddForm({ className, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      employeeId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        // Remove confirmPassword before sending to API
        const { confirmPassword, ...userData } = values;
        
        await dispatch(createUser(userData)).unwrap();
        toast.success("User created successfully");
        handleCancel();
      } catch (error) {
        toast.error(error.message || "Failed to create user");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    // setIsModalOpen(false);
    dispatch(modalClosed());
  };

  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={formik.handleSubmit}>
      <div className="grid gap-4 border p-4 rounded">
        <h3 className="font-semibold">Basic Information</h3>
        
        <div className="grid gap-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input
            id="employeeId"
            {...formik.getFieldProps('employeeId')}
            className={cn(formik.errors.employeeId && formik.touched.employeeId ? "border-red-300" : null)}
          />
          {formik.errors.employeeId && formik.touched.employeeId && (
            <span className="text-red-500 text-sm">{formik.errors.employeeId}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...formik.getFieldProps('firstName')}
              className={cn(formik.errors.firstName && formik.touched.firstName ? "border-red-300" : null)}
            />
            {formik.errors.firstName && formik.touched.firstName && (
              <span className="text-red-500 text-sm">{formik.errors.firstName}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...formik.getFieldProps('lastName')}
              className={cn(formik.errors.lastName && formik.touched.lastName ? "border-red-300" : null)}
            />
            {formik.errors.lastName && formik.touched.lastName && (
              <span className="text-red-500 text-sm">{formik.errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...formik.getFieldProps('email')}
            className={cn(formik.errors.email && formik.touched.email ? "border-red-300" : null)}
          />
          {formik.errors.email && formik.touched.email && (
            <span className="text-red-500 text-sm">{formik.errors.email}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            {...formik.getFieldProps('phoneNumber')}
            className={cn(formik.errors.phoneNumber && formik.touched.phoneNumber ? "border-red-300" : null)}
          />
          {formik.errors.phoneNumber && formik.touched.phoneNumber && (
            <span className="text-red-500 text-sm">{formik.errors.phoneNumber}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...formik.getFieldProps('password')}
              className={cn(formik.errors.password && formik.touched.password ? "border-red-300" : null)}
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500 text-sm">{formik.errors.password}</span>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...formik.getFieldProps('confirmPassword')}
              className={cn(formik.errors.confirmPassword && formik.touched.confirmPassword ? "border-red-300" : null)}
            />
            {formik.errors.confirmPassword && formik.touched.confirmPassword && (
              <span className="text-red-500 text-sm">{formik.errors.confirmPassword}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 border p-4 rounded">
        <h3 className="font-semibold">Role & Department</h3>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formik.values.role}
            onValueChange={(value) => formik.setFieldValue("role", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Roles</SelectLabel>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {formik.errors.role && formik.touched.role && (
            <span className="text-red-500 text-sm">{formik.errors.role}</span>
          )}
        </div>

      
      </div>

      <DrawerFooter className="pt-2">
        <DrawerClose asChild>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? "Creating..." : "Create User"}
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


function UsersAdd() {
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
          <BiPlus /> Add User
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
            <DrawerTitle>Add User</DrawerTitle>
            <DrawerDescription>
              Create a new user account. Fill in all required fields.
            </DrawerDescription>
          </DrawerHeader>
          <UsersAddForm className="px-4" />
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

export default UsersAdd;
