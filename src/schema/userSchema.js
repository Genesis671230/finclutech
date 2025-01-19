import * as yup from 'yup'

export const userSchema = yup.object({
    name: yup.string().required("First Name Is required"),
    mobileNumber: yup.string().required("Phone Number Is required"),
    // .matches(/^\d{10}$/, "Phone Number must be exactly 10 digits"),
    email: yup.string().email().required("Email Is required"),
})