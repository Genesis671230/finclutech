import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { createUser } from "features/users/userSlice";
// Chakra imports
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import bgFinclutechVideo from "../../../assets/video/finclutech.mp4";

// Assets
import illustration from "../../../assets/img/logo/finclutechLogo.png";

import { MdOutlineRemoveRedEye } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { postApi } from "services/api";
import { loginSchema } from "schema";
import { toast } from "react-toastify";
import Spinner from "components/spinner/Spinner";

const OnboardingTour = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: "/path/to/payment-image.png",
      title: "Your One Solution",
      description: "Manage all your payments and banking needs in one place",
      color: "blue.500",
    },
    {
      image: "/path/to/international-image.png",
      title: "Global Reach",
      description: "Seamless international transactions at your fingertips",
      color: "purple.500",
    },
    {
      image: "/path/to/crypto-image.png",
      title: "Crypto Ready",
      description: "Future-proof your finances with crypto integration",
      color: "green.500",
    },
  ];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <div className="container mx-auto h-screen flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-8 max-w-2xl w-full"
          >
            <motion.div
              key={currentSlide}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="text-center"
            >
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="mx-auto h-64 object-contain mb-8"
              />
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: slides[currentSlide].color }}
              >
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-600 mb-8">
                {slides[currentSlide].description}
              </p>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setCurrentSlide((prev) => prev - 1)}
                  disabled={currentSlide === 0}
                  className="px-6 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                >
                  Previous
                </button>
                {currentSlide === slides.length - 1 ? (
                  <button
                    onClick={onComplete}
                    className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Get Started
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentSlide((prev) => prev + 1)}
                    className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                  >
                    Next
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const RegisterForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      employeeId: "",
    },
    // validationSchema: registerSchema, // Create this schema
    onSubmit: async (values) => {
      try {
        await dispatch(createUser({ ...values, role: "user" })).unwrap();
        onSuccess();
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormControl
            isInvalid={formik.errors.firstName && formik.touched.firstName}
          >
            <FormLabel className="text-sm">First Name</FormLabel>
            <Input {...formik.getFieldProps("firstName")} className="border-2 border-gray-300 rounded-md p-2 text-sm" placeholder="Enter your first name" />
            <FormErrorMessage>{formik.errors.firstName}</FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={formik.errors.lastName && formik.touched.lastName}
          >
            <FormLabel className="text-sm">Last Name</FormLabel>
            <Input {...formik.getFieldProps("lastName")} clas placeholder="Enter your last name" />
            <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
          </FormControl>
        </div>

        <FormControl isInvalid={formik.errors.email && formik.touched.email}>
          <FormLabel className="text-sm">Email</FormLabel>
          <Input {...formik.getFieldProps("email")} type="email" clas placeholder="Enter your email" />
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.phoneNumber && formik.touched.phoneNumber}
        >
          <FormLabel className="text-sm">Phone Number</FormLabel>
          <Input {...formik.getFieldProps("phoneNumber")} clas placeholder="Enter your phone number" />
          <FormErrorMessage>{formik.errors.phoneNumber}</FormErrorMessage>
        </FormControl>

        <FormControl
          isInvalid={formik.errors.password && formik.touched.password}
        >
          <FormLabel className="text-sm">Password</FormLabel>
          <Input {...formik.getFieldProps("password")} type="password" clas placeholder="Enter your password" />
          <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
        </FormControl>

      
        <Button
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    type="submit"
                    mb="24px"
                    disabled={formik.isSubmitting ? true : false}
                  >
                    {formik.isSubmitting ? <Spinner /> : "Create Account"}
                  </Button>
      </form>
    </motion.div>
  );
};

function SignIn() {
  // Chakra color mode
  const textColor = useColorModeValue("navy.700", "white");
  const textColorSecondary = "gray.400";
  const brandStars = useColorModeValue("brand.500", "brand.400");
  const [isLoding, setIsLoding] = React.useState(false);
  const [checkBox, setCheckBox] = React.useState(true);

  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);

  const initialValues = {
    email: "",
    password: "",
  };
  const {
    errors,
    values,
    touched,
    handleBlur,
    handleChange,
    resetForm,
    handleSubmit,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: (values, { resetForm }) => {
      login();
    },
  });
  const navigate = useNavigate();

  const login = async () => {
    try {
      setIsLoding(true);
      let response = await postApi("api/user/login", values, checkBox);
      if (response && response.status === 200) {
        navigate("/admin");
        toast.success("Login Successfully!");
        resetForm();
      } else {
        toast.error(response?.response.data?.error);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const [showRegister, setShowRegister] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleRegisterSuccess = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    navigate("/admin");
  };

  return (
    <>
      <div className="container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <video
            autoPlay
            loop
            className="z-20 absolute inset-0 object-cover overflow-hidden max-h-[100vh] h-[80vh]"
            width={960}
            height={6}
            controls={false}
            muted
          >
            <source src={bgFinclutechVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Finclutech
          </div>

          {/* <img
          src={"https://unsplash.com/random/?laptop"}
          className='relative m-auto'
          width={301}
          height={60}
          alt='Vite'
        /> */}

          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Finclutech efficiently manages all aspects of the
                FinClutech company's operations. From handling sales orders and
                generating quotations to processing invoices and overseeing
                services and products, to streamline and enhance business
                processes.&rdquo;
              </p>
              <footer className="text-sm">Hamza "CTO @ Zephrex"</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">{showRegister ? "Register" : "Login"}</h1>
              <p className="text-sm text-muted-foreground">
                {showRegister ? "Enter your details below to create an account" : "Enter your email and password below to log into your account"}
              </p>
            </div>
            {/* <UserAuthForm /> */}
            {showRegister ? (
              <AnimatePresence mode="wait">
                {showRegister && (
                  <RegisterForm onSuccess={handleRegisterSuccess} />
                )}
              </AnimatePresence>
            ) : (
              <form onSubmit={handleSubmit}>
                <FormControl isInvalid={errors.email && touched.email}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Email<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    name="email"
                    ms={{ base: "0px", md: "0px" }}
                    type="email"
                    placeholder="mail@gmail.com"
                    mb={errors.email && touched.email ? undefined : "24px"}
                    fontWeight="500"
                    size="lg"
                    borderColor={
                      errors.email && touched.email ? "red.300" : null
                    }
                    className={
                      errors.email && touched.email ? "isInvalid" : null
                    }
                  />
                  {errors.email && touched.email && (
                    <FormErrorMessage mb="24px">
                      {" "}
                      {errors.email}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={errors.password && touched.password}
                  mb="24px"
                >
                  <FormLabel
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    display="flex"
                  >
                    Password<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <InputGroup size="md">
                    <Input
                      isRequired={true}
                      fontSize="sm"
                      placeholder="Enter Your Password"
                      name="password"
                      mb={
                        errors.password && touched.password ? undefined : "24px"
                      }
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      size="lg"
                      variant="auth"
                      type={show ? "text" : "password"}
                      borderColor={
                        errors.password && touched.password ? "red.300" : null
                      }
                      className={
                        errors.password && touched.password ? "isInvalid" : null
                      }
                    />
                    <InputRightElement
                      display="flex"
                      alignItems="center"
                      mt="4px"
                    >
                      <Icon
                        color={textColorSecondary}
                        _hover={{ cursor: "pointer" }}
                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                        onClick={showPass}
                      />
                    </InputRightElement>
                  </InputGroup>
                  {errors.password && touched.password && (
                    <FormErrorMessage mb="24px">
                      {" "}
                      {errors.password}
                    </FormErrorMessage>
                  )}
                  <Flex justifyContent="space-between" align="center" mb="24px">
                    <FormControl display="flex" alignItems="center">
                      <Checkbox
                        onChange={(e) => setCheckBox(e.target.checked)}
                        id="remember-login"
                        value={checkBox}
                        defaultChecked
                        className="bg-[#f5f5f5]"
                        colorScheme="brandScheme"
                        me="10px"
                      />
                      <FormLabel
                        htmlFor="remember-login"
                        mb="0"
                        fontWeight="normal"
                        color={textColor}
                        fontSize="sm"
                      >
                        Keep me logged in
                      </FormLabel>
                    </FormControl>
                  </Flex>

                  <Flex
                    justifyContent="space-between"
                    align="center"
                    mb="24px"
                  ></Flex>
                  <Button
                    fontSize="sm"
                    variant="brand"
                    fontWeight="500"
                    w="100%"
                    h="50"
                    type="submit"
                    mb="24px"
                    disabled={isLoding ? true : false}
                  >
                    {isLoding ? <Spinner /> : "Sign In"}
                  </Button>
                </FormControl>
              </form>
            )}

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking login, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
            {!showRegister ? (
              <div className="mt-4 text-center">
                <Text color="gray.600">Don't have an account?</Text>
                <Button
                  variant="link"
                  className="text-primary"
                  onClick={() => setShowRegister(true)}
                  >
                  Register now
                </Button>
              </div>
            ): (
              <div className="mt-4 text-center">
                <Text color="gray.600">Already have an account?</Text>
                <Button
                className="text-primary"
                  variant="link"
                  onClick={() => setShowRegister(false)}
                >
                  Login now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showOnboarding && (
          <OnboardingTour onComplete={handleOnboardingComplete} />
        )}
      </AnimatePresence>
    </>
  );
}

export default SignIn;
