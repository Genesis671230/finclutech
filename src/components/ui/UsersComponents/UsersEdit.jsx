import React, { useEffect, useState } from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useFormik } from "formik";
import { cn } from "lib/utils.ts";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { putApi } from "services/api";
import * as Yup from "yup";
import { modalClosed } from "../../../redux/slices/editModalSlice/editModalSlice.js";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { DrawerClose, DrawerFooter } from "../drawer";
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
import { updateUser, fetchUserEntries } from "../../../features/users/userSlice";

const userSchema = Yup.object({
  firstName: Yup.string()
    .required("First Name is required")
    .min(2, "First name must be at least 2 characters"),
  lastName: Yup.string()
    .required("Last Name is required")
    .min(2, "Last name must be at least 2 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\+?[\d\s-]{10,}$/, "Invalid phone number"),
  role: Yup.string().required("Role is required"),
  department: Yup.string().required("Department is required"),
  employeeId: Yup.string()
    .required("Employee ID is required")
    .min(3, "Employee ID must be at least 3 characters"),
  dateOfBirth: Yup.string().required("Date of Birth is required"),
  dateOfJoining: Yup.string().required("Date of Joining is required"),
});

const DatePicker = React.memo((props) => {
  const { name, value, onDateChange } = props;
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : null);

  const handleDateChange = React.useCallback(
    (date) => {
      onDateChange(format(date, "yyyy-MM-dd"));
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
          className="whitespace-nowrap"
          mode="single"
          selected={currentDate}
          onSelect={handleDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
});

function UsersEdit({ className, userData, setIsModalOpen }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userEntries, setUserEntries] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userData?._id) {
      dispatch(fetchUserEntries(userData._id))
        .unwrap()
        .then(entries => setUserEntries(entries))
        .catch(error => toast.error("Failed to fetch user entries"));
    }
  }, [userData?._id, dispatch]);

  const initialValues = {
    firstName: userData?.firstName ?? "",
    lastName: userData?.lastName ?? "",
    email: userData?.email ?? "",
    phone: userData?.phone ?? "",
    role: userData?.role ?? "",
    department: userData?.department ?? "",
    employeeId: userData?.employeeId ?? "",
    dateOfBirth: userData?.dateOfBirth ?? "",
    dateOfJoining: userData?.dateOfJoining ?? "",
    address: userData?.address ?? "",
    city: userData?.city ?? "",
    state: userData?.state ?? "",
    country: userData?.country ?? "",
    postalCode: userData?.postalCode ?? "",
    emergencyContact: userData?.emergencyContact ?? "",
    emergencyPhone: userData?.emergencyPhone ?? "",
    specialization: userData?.specialization ?? "",
    certifications: userData?.certifications ?? "",
    experience: userData?.experience ?? "",
    skills: userData?.skills ?? "",
    languages: userData?.languages ?? "",
    salary: userData?.salary ?? "",
    status: userData?.status ?? "active",
    notes: userData?.notes ?? "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: userSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        await dispatch(updateUser({ id: userData._id, userData: values })).unwrap();
        toast.success("User updated successfully");
        handleCancel();
      } catch (error) {
        toast.error(error.message || "Failed to update user");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const {
    errors,
    touched,
    values,
    handleBlur,
    handleChange,
    handleSubmit: formikSubmit,
    setFieldValue,
  } = formik;

  const handleCancel = () => {
    formik.resetForm();
    setIsModalOpen(false);
    dispatch(modalClosed());
  };

  return (
    <form
      className={cn("grid items-start gap-4 overflow-auto", className)}
      onSubmit={formikSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(errors.firstName && touched.firstName ? "border-red-300" : null)}
          />
          {errors.firstName && touched.firstName && (
            <span className="text-red-500 text-sm">{errors.firstName}</span>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            className={cn(errors.lastName && touched.lastName ? "border-red-300" : null)}
          />
          {errors.lastName && touched.lastName && (
            <span className="text-red-500 text-sm">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(errors.email && touched.email ? "border-red-300" : null)}
        />
        {errors.email && touched.email && (
          <span className="text-red-500 text-sm">{errors.email}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(errors.phone && touched.phone ? "border-red-300" : null)}
        />
        {errors.phone && touched.phone && (
          <span className="text-red-500 text-sm">{errors.phone}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={values.role}
          onValueChange={(value) => setFieldValue("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Roles</SelectLabel>
              <SelectItem value="technician">Technician</SelectItem>
              <SelectItem value="salesperson">Salesperson</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.role && touched.role && (
          <span className="text-red-500 text-sm">{errors.role}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="department">Department</Label>
        <Select
          value={values.department}
          onValueChange={(value) => setFieldValue("department", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Departments</SelectLabel>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="parts">Parts</SelectItem>
              <SelectItem value="admin">Administration</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.department && touched.department && (
          <span className="text-red-500 text-sm">{errors.department}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input
          id="employeeId"
          name="employeeId"
          value={values.employeeId}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(errors.employeeId && touched.employeeId ? "border-red-300" : null)}
        />
        {errors.employeeId && touched.employeeId && (
          <span className="text-red-500 text-sm">{errors.employeeId}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <DatePicker
          name="dateOfBirth"
          value={values.dateOfBirth}
          onDateChange={(date) => setFieldValue("dateOfBirth", date)}
        />
        {errors.dateOfBirth && touched.dateOfBirth && (
          <span className="text-red-500 text-sm">{errors.dateOfBirth}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="dateOfJoining">Date of Joining</Label>
        <DatePicker
          name="dateOfJoining"
          value={values.dateOfJoining}
          onDateChange={(date) => setFieldValue("dateOfJoining", date)}
        />
        {errors.dateOfJoining && touched.dateOfJoining && (
          <span className="text-red-500 text-sm">{errors.dateOfJoining}</span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="specialization">Specialization</Label>
        <Select
          value={values.specialization}
          onValueChange={(value) => setFieldValue("specialization", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Specializations</SelectLabel>
              <SelectItem value="engine">Engine Specialist</SelectItem>
              <SelectItem value="electrical">Electrical Systems</SelectItem>
              <SelectItem value="bodywork">Body Work</SelectItem>
              <SelectItem value="transmission">Transmission</SelectItem>
              <SelectItem value="diagnostics">Diagnostics</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="experience">Years of Experience</Label>
        <Input
          id="experience"
          name="experience"
          type="number"
          value={values.experience}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="certifications">Certifications</Label>
        <Input
          id="certifications"
          name="certifications"
          value={values.certifications}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="ASE, Manufacturer certifications, etc."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          name="skills"
          value={values.skills}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Diagnostic tools, specific vehicle brands, etc."
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="salary">Salary</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          value={values.salary}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={values.status}
          onValueChange={(value) => setFieldValue("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="onLeave">On Leave</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          name="notes"
          value={values.notes}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Additional notes about the employee"
        />
      </div>

      {/* User Entries Section */}
      {userEntries.length > 0 && (
        <div className="grid gap-4 border p-4 rounded">
          <h3 className="font-semibold">Service Entries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2">Service</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {userEntries.map((entry) => (
                  <tr key={entry._id}>
                    <td className="px-4 py-2">{entry.serviceName}</td>
                    <td className="px-4 py-2">
                      {format(new Date(entry.createdAt), 'PPP')}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        entry.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : entry.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DrawerFooter className="pt-2">
        <DrawerClose asChild>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Employee"}
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

export default UsersEdit;
