import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import Dropzone from "components/Dropzone";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { MdOutlineRemoveRedEye, MdUpload } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userSchema } from "schema";
import { getApi, putApi } from "services/api";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  useColorModeValue,
  Checkbox,
} from "@chakra-ui/react";
import { authorities,locations } from "constant";

const initialValues = {
  role: "",
  propertyCanAdd: "",
  name: "",
  mobileNumber: "",
  reportingTo: "",
  dob: "",
  email: "",
  address: "",
  target: "",
  targetDate: "",
  revenuePercentage: "",
  confirmPassword: "",
  profilePicture: null,
  profilePictureRemarks: "",
  offerLetter: null,
  offerLetterRemarks: "",
  passportCopy: null,
  passportCopyRemarks: "",
  visaPage: null,
  visaPageRemarks: "",
  labourCard: null,
  labourCardRemarks: "",
  emiratesId: null,
  emiratesIdRemarks: "",
  status: "",
  able: "",
  doj: "",
  authorities: [],
  locations: [],
  // Add more field names here
};

const Edit = (props) => {
  const { onClose,userId, isOpen, fetchData } = props;
  const [isLoding, setIsLoding] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState([]);

  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";

  const [show, setShow] = useState(false);
  const showPass = () => setShow(!show);

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: userSchema,
    onSubmit: (values, { resetForm }) => {
      EditData();
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

  const handleCheckboxAuthorityChange = (authority_id) => {
    const findAuthority = selectedAuthorities?.find(
      (selected) => selected?.id === authority_id
    );

    if (findAuthority) {
      setSelectedAuthorities((prevSelected) =>
        prevSelected.filter((selected) => selected.id !== authority_id)
      );
    } else {
      setSelectedAuthorities((prevSelected) => [
        ...prevSelected,
        authorities?.find((selected) => selected?.id === authority_id),
      ]);
    }
  };

  const handleCheckboxLocationChange = (location_id) => {
    const findLocation = selectedLocations.find(
      (selected) => selected?.id === location_id
    );

    if (findLocation) {
      setSelectedLocations((prevSelected) =>
        prevSelected.filter((selected) => selected.id !== location_id)
      );
    } else {
      setSelectedLocations((prevSelected) => [
        ...prevSelected,
        locations?.find((selected) => selected?.id === location_id),
      ]);
    }
  };

  const EditData = async () => {
    try {
      setIsLoding(true);
      console.log(values, "these are values");
      const formData = new FormData();

      if (values?.profilePicture?.length > 0) {
        values?.profilePicture?.forEach((file) => {
          console.log(file, "file");
          formData?.append("profilePicture", file);
        });
      }

      if (values?.offerLetter?.length > 0) {
        values?.offerLetter?.forEach((file) => {
          console.log(file, "file");
          formData?.append("offerLetter", file);
        });
      }

      if (values?.passportCopy?.length > 0) {
        values?.passportCopy?.forEach((file) => {
          console.log(file, "file");
          formData?.append("passportCopy", file);
        });
      }

      if (values?.visaPage?.length > 0) {
        values?.visaPage?.forEach((file) => {
          console.log(file, "file");
          formData?.append("visaPage", file);
        });
      }
      
      if (values?.emiratesId?.length > 0) {
        values?.emiratesId?.forEach((file) => {
          console.log(file, "file");
          formData?.append("emiratesId", file);
        });
      }
      
      if (values?.labourCard?.length > 0) {
        values?.labourCard?.forEach((file) => {
          console.log(file, "file");
          formData?.append("labourCard", file);
        });
      }

      formData.append("locations", JSON.stringify(selectedLocations));
      formData.append("authorities", JSON.stringify(selectedAuthorities));

      const res = Object.entries(values);
      console.log(res, "res");
      res?.forEach((item) => {
        if (
          ![
            "profilePicture",
            "offerLetter",
            "passportCopy",
            "visaPage",
            "emiratesId",
            "labourCard",
            "authorities",
            "locations",
          ].includes(item[0])
        ) {
          formData.append(item[0], item[1]);
        }
        console.log(item, "key value");
      });
      console.log(formData.get("authorities"), "formdata");

      let response = await putApi(`api/user/edit/${param.id? param.id:userId}`, formData);
      if (response && response.status === 200) {
        props.onClose();
        fetchData();
      } else {
        toast.error(response.response.data?.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoding(false);
    }
  };

  const param = useParams();
  const fetcEdithData = async () => {
    const id = param.id ? param.id : userId;
    let response = await getApi("api/user/", id);
    console.log(response.data);
    setFieldValue("firstName", response.data?.firstName);
    setFieldValue("lastName", response.data?.lastName);
    setFieldValue("email", response.data?.email);
    setFieldValue("phoneNumber", response.data?.phoneNumber);
    setFieldValue("role", response.data?.role);
    setFieldValue("email", response.data?.email);
    setFieldValue("confirmPassword", response.data?.confirmPassword);
   };
  // Add more field names here

  useEffect(() => {
    fetcEdithData();
  }, [props]);

  console.log(values, "values")
  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent maxWidth={"40vw"}>
        <ModalHeader justifyContent="space-between" display="flex">
          Edit User
          <IconButton onClick={() => onClose(false)} icon={<CloseIcon />} />
        </ModalHeader>
        <ModalBody>
          {/* <Grid templateColumns="repeat(12, 1fr)" gap={3}>

                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                First Name
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.firstName}
                                name="firstName"
                                placeholder='firstName'
                                fontWeight='500'
                                borderColor={errors.firstName && touched.firstName ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.firstName && touched.firstName && errors.firstName}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Last Name
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.lastName}
                                name="lastName"
                                placeholder='Last Name'
                                fontWeight='500'
                                borderColor={errors.lastName && touched.lastName ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.lastName && touched.lastName && errors.lastName}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Email
                            </FormLabel>
                            <Input
                                fontSize='sm'
                                type='email'
                                onChange={handleChange} onBlur={handleBlur}
                                value={values.email}
                                name="email"
                                placeholder='Email Address'
                                fontWeight='500'
                                borderColor={errors.email && touched.email ? "red.300" : null}
                            />
                            <Text mb='10px' color={'red'}> {errors.email && touched.email && errors.email}</Text>
                        </GridItem>
                        <GridItem colSpan={{ base: 12 }}>
                            <FormLabel display='flex' ms='4px' fontSize='sm' fontWeight='500' mb='8px'>
                                Phone Number<Text color={"red"}>*</Text>
                            </FormLabel>
                            <InputGroup>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<PhoneIcon color="gray.300" borderRadius="16px" />}
                                />
                                <Input type="tel"
                                    fontSize='sm'
                                    onChange={handleChange} onBlur={handleBlur}
                                    value={values.phoneNumber}
                                    name="phoneNumber"
                                    fontWeight='500'
                                    borderColor={errors.phoneNumber && touched.phoneNumber ? "red.300" : null}
                                    placeholder="Phone number" borderRadius="16px" />
                            </InputGroup>
                            <Text mb='10px' color={'red'}>{errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}</Text>
                        </GridItem>
                    </Grid> */}
          <ModalBody>
            <Grid
              flexWrap="wrap"
              maxHeight="80vh"
              overflow={"auto"}
              templateColumns="repeat(12, 1fr)"
              display={"grid"}
              gap={3}
            >
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  role<Text color={"red"}>*</Text>
                </FormLabel>

                <Select
                  value={values.role}
                  name="role"
                  onChange={handleChange}
                  fontWeight="500"
                  placeholder={"Select user role"}
                  borderColor={
                    errors.listingStatus && touched.listingStatus
                      ? "red.300"
                      : null
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="agent">Agent</option>
                  <option value="user">user</option>
                </Select>
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.role && touched.role && errors.role}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12, sm: 6 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Property Can Add
                </FormLabel>
                <RadioGroup
                  onChange={(e) => setFieldValue("propertyCanAdd", e)}
                  value={values.propertyCanAdd}
                >
                  <Stack direction="row">
                    <Radio value="yes">Yes</Radio>
                    <Radio value="no">No</Radio>
                  </Stack>
                </RadioGroup>
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.propertyCanAdd &&
                    touched.propertyCanAdd &&
                    errors.propertyCanAdd}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Name<Text color={"red"}>*</Text>
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  name="name"
                  placeholder="Name"
                  fontWeight="500"
                  borderColor={errors.name && touched.name ? "red.300" : null}
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.name && touched.name && errors.name}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Mobile Number<Text color={"red"}>*</Text>
                </FormLabel>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      <PhoneIcon color="gray.300" borderRadius="16px" />
                    }
                  />
                  <Input
                    type="tel"
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.mobileNumber}
                    name="mobileNumber"
                    fontWeight="500"
                    borderColor={
                      errors.mobileNumber && touched.mobileNumber
                        ? "red.300"
                        : null
                    }
                    placeholder="Mobile Number"
                    borderRadius="16px"
                  />
                </InputGroup>
                <Text mb="10px" color={"red"}>
                  {errors.mobileNumber &&
                    touched.mobileNumber &&
                    errors.mobileNumber}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Reporting to
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.reportingTo}
                  name="reportingTo"
                  placeholder="Reporting to"
                  fontWeight="500"
                  borderColor={
                    errors.reportingTo && touched.reportingTo ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.reportingTo &&
                    touched.reportingTo &&
                    errors.reportingTo}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  DOB
                </FormLabel>
                <Input
                  type="date"
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.dob}
                  name="dob"
                  placeholder="dd/mm/yyyy"
                  fontWeight="500"
                  borderColor={errors.dob && touched.dob ? "red.300" : null}
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.dob && touched.dob && errors.dob}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Mail-Id
                </FormLabel>
                <Input
                  fontSize="sm"
                  type="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  name="email"
                  placeholder="Mail-Id"
                  fontWeight="500"
                  borderColor={
                    errors.email && touched.email ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.email && touched.email && errors.email}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Address
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.address}
                  name="address"
                  placeholder="Address"
                  fontWeight="500"
                  borderColor={
                    errors.address && touched.address ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.address && touched.address && errors.address}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Target
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.target}
                  name="target"
                  placeholder="Target"
                  fontWeight="500"
                  borderColor={
                    errors.target && touched.target ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.target && touched.target && errors.target}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Target Date
                </FormLabel>
                <Input
                  type="date"
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.targetDate}
                  name="targetDate"
                  placeholder="dd/mm/yyyy"
                  fontWeight="500"
                  borderColor={
                    errors.targetDate && touched.targetDate ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.targetDate && touched.targetDate && errors.targetDate}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Revenue Percentage
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.revenuePercentage}
                  name="revenuePercentage"
                  placeholder="Revenue Percentage"
                  fontWeight="500"
                  borderColor={
                    errors.revenuePercentage && touched.revenuePercentage
                      ? "red.300"
                      : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.revenuePercentage &&
                    touched.revenuePercentage &&
                    errors.revenuePercentage}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Password<Text color={"red"}>*</Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Enter Your Password"
                    name="password"
                    size="lg"
                    variant="auth"
                    type={show ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
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
                      color={"gray.400"}
                      _hover={{ cursor: "pointer" }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={showPass}
                    />
                  </InputRightElement>
                </InputGroup>
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.password && touched.password && errors.password}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Confirm Password<Text color={"red"}>*</Text>
                </FormLabel>
                <InputGroup size="md">
                  <Input
                    isRequired={true}
                    fontSize="sm"
                    placeholder="Confirm Your Password"
                    name="confirmPassword"
                    size="lg"
                    variant="auth"
                    type={show ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    borderColor={
                      errors.confirmPassword && touched.confirmPassword
                        ? "red.300"
                        : null
                    }
                    className={
                      errors.confirmPassword && touched.confirmPassword
                        ? "isInvalid"
                        : null
                    }
                  />
                  <InputRightElement
                    display="flex"
                    alignItems="center"
                    mt="4px"
                  >
                    <Icon
                      color={"gray.400"}
                      _hover={{ cursor: "pointer" }}
                      as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                      onClick={showPass}
                    />
                  </InputRightElement>
                </InputGroup>
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.confirmPassword &&
                    touched.confirmPassword &&
                    errors.confirmPassword}
                </Text>
              </GridItem>
              <GridItem
                colSpan={{ base: 12 }}
                display={"flex"}
                flexWrap="wrap"
                marginBottom="6rem"
                gap="10rem"
                className="mb-[6rem]"
              >
                <GridItem colSpan={{ base: 12 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Profile Picture
                  </FormLabel>

                  <Dropzone
                    // w={{ base: "100%", "2xl": "240px" }}
                    me="36px"
                    minH={150}
                    height={"100%"}
                    onFileSelect={(file) =>
                      setFieldValue("profilePicture", file)
                    }
                    content={
                      <Box>
                        <Icon
                          as={MdUpload}
                          w="70px"
                          h="70px"
                          color={brandColor}
                        />
                        <Flex flexDirection={"column"} justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Profile Picture
                          </Text>
                          {values.profilePicture?.length > 0 && (
                            <Text
                              fontSize="md"
                              fontWeight="700"
                              color={brandColor}
                            >
                              {" "}{values.profilePicture?.length}
                            </Text>
                          )}
                        </Flex>
                      </Box>
                    }
                  />
                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.profilePictureRemarks}
                    name="profilePictureRemarks"
                    placeholder="Remarks"
                    fontWeight="500"
                    borderColor={
                      errors.profilePictureRemarks &&
                      touched.profilePictureRemarks
                        ? "red.300"
                        : null
                    }
                  />
                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.profilePictureRemarks &&
                      touched.profilePictureRemarks &&
                      errors.profilePictureRemarks}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Offer letter
                  </FormLabel>

                  <Dropzone
                    // w={{ base: "100%", "2xl": "240px" }}
                    me="36px"
                    minH={150}
                    height={"100%"}
                    onFileSelect={(file) => setFieldValue("offerLetter", file)}
                    content={
                      <Box>
                        <Icon
                          as={MdUpload}
                          w="70px"
                          h="70px"
                          color={brandColor}
                        />
                        <Flex justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Offer Letter
                          </Text>
                        </Flex>
                      </Box>
                    }
                  />
                  {/* </GridItem> */}

                  {/* <GridItem colSpan={{ base: 12 }}> */}

                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.offerLetterRemarks}
                    name="offerLetterRemarks"
                    placeholder="Remarks"
                    fontWeight="500"
                    borderColor={
                      errors.offerLetterRemarks && touched.offerLetterRemarks
                        ? "red.300"
                        : null
                    }
                  />
                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.offerLetterRemarks &&
                      touched.offerLetterRemarks &&
                      errors.offerLetterRemarks}
                  </Text>
                  {/* </GridItem> */}
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Passport Copy
                  </FormLabel>

                  <Dropzone
                    // w={{ base: "100%", "2xl": "240px" }}
                    me="36px"
                    minH={150}
                    height={"100%"}
                    onFileSelect={(file) => setFieldValue("passportCopy", file)}
                    content={
                      <Box>
                        <Icon
                          as={MdUpload}
                          w="70px"
                          h="70px"
                          color={brandColor}
                        />
                        <Flex justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Passport Copy
                          </Text>
                        </Flex>
                      </Box>
                    }
                  />
                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.passportCopyRemarks}
                    name="passportCopyRemarks"
                    placeholder="Remarks"
                    fontWeight="500"
                    borderColor={
                      errors.passportCopyRemarks && touched.passportCopyRemarks
                        ? "red.300"
                        : null
                    }
                  />
                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.passportCopyRemarks &&
                      touched.passportCopyRemarks &&
                      errors.passportCopyRemarks}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Visa page
                  </FormLabel>
                  <Dropzone
                    // w={{ base: "100%", "2xl": "240px" }}
                    me="36px"
                    minH={150}
                    height={"100%"}
                    onFileSelect={(file) => setFieldValue("visaPage", file)}
                    content={
                      <Box>
                        <Icon
                          as={MdUpload}
                          w="70px"
                          h="70px"
                          color={brandColor}
                        />
                        <Flex justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Visa Page
                          </Text>
                        </Flex>
                      </Box>
                    }
                  />
                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.visaPageRemarks}
                    name="visaPageRemarks"
                    placeholder="Remarks"
                    fontWeight="500"
                    borderColor={
                      errors.visaPageRemarks && touched.visaPageRemarks
                        ? "red.300"
                        : null
                    }
                  />
                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.visaPageRemarks &&
                      touched.visaPageRemarks &&
                      errors.visaPageRemarks}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Labour Card
                  </FormLabel>

                  <Dropzone
                    // w={{ base: "100%", "2xl": "240px" }}
                    me="36px"
                    minH={150}
                    height={"100%"}
                    onFileSelect={(file) => setFieldValue("labourCard", file)}
                    content={
                      <Box>
                        <Icon
                          as={MdUpload}
                          w="70px"
                          h="70px"
                          color={brandColor}
                        />
                        <Flex justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Labour Card
                          </Text>
                        </Flex>
                      </Box>
                    }
                  />
                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.labourCardRemarks}
                    name="labourCardRemarks"
                    placeholder="Remarks"
                    fontWeight="500"
                    borderColor={
                      errors.labourCardRemarks && touched.labourCardRemarks
                        ? "red.300"
                        : null
                    }
                  />
                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.labourCardRemarks &&
                      touched.labourCardRemarks &&
                      errors.labourCardRemarks}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 12 }}>
                  <FormLabel
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Emirates ID
                  </FormLabel>

                  <Dropzone
                    // w={{ base: "100%", "2xl": "240px" }}
                    me="36px"
                    minH={150}
                    height={"100%"}
                    onFileSelect={(file) => setFieldValue("emiratesId", file)}
                    content={
                      <Box>
                        <Icon
                          as={MdUpload}
                          w="70px"
                          h="70px"
                          color={brandColor}
                        />
                        <Flex justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Emirates Id
                          </Text>
                        </Flex>
                      </Box>
                    }
                  />

                  <Input
                    fontSize="sm"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.emiratesIdRemarks}
                    name="emiratesIdRemarks"
                    placeholder="Remarks"
                    fontWeight="500"
                    borderColor={
                      errors.emiratesIdRemarks && touched.emiratesIdRemarks
                        ? "red.300"
                        : null
                    }
                  />
                  <Text mb="10px" color={"red"}>
                    {" "}
                    {errors.emiratesIdRemarks &&
                      touched.emiratesIdRemarks &&
                      errors.emiratesIdRemarks}
                  </Text>
                </GridItem>
              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Status
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.status}
                  name="status"
                  placeholder="Status"
                  fontWeight="500"
                  borderColor={
                    errors.status && touched.status ? "red.300" : null
                  }
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.status && touched.status && errors.status}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Able
                </FormLabel>
                <Input
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.able}
                  name="able"
                  placeholder="Able"
                  fontWeight="500"
                  borderColor={errors.able && touched.able ? "red.300" : null}
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.able && touched.able && errors.able}
                </Text>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  DOJ
                </FormLabel>
                <Input
                  type="date"
                  fontSize="sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.doj}
                  name="doj"
                  placeholder="dd/mm/yyyy"
                  fontWeight="500"
                  borderColor={errors.doj && touched.doj ? "red.300" : null}
                />
                <Text mb="10px" color={"red"}>
                  {" "}
                  {errors.doj && touched.doj && errors.doj}
                </Text>
              </GridItem>

              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Authorities
                </FormLabel>
                <Box
                  width="max-content"
                  display="grid"
                  gridTemplateColumns="1fr 1fr"
                  paddingLeft="4px"
                  gridColumnGap="4rem"
                  spacing={2}
                >
                  {authorities?.map((authority, index) => (
                    <Checkbox
                      key={authority?.id}
                      id={`authority_${authority?.label}`}
                      name={`authority_${authority?.label}`}
                      value={authority?.label}
                      // isChecked={formik.values?.authorities?.includes(
                      //   authority?.label
                      // )}
                      isChecked={
                        selectedAuthorities?.find((au) => au.id == authority.id)
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleCheckboxAuthorityChange(authority?.id)
                      }
                    >
                      {authority?.label}
                    </Checkbox>
                  ))}
                </Box>
              </GridItem>
              <GridItem colSpan={{ base: 12 }}>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Locations
                </FormLabel>
                <Box
                  width="max-content"
                  display="grid"
                  gridTemplateColumns="1fr 1fr"
                  paddingLeft="4px"
                  gridColumnGap="6.7rem"
                  spacing={2}
                >
                  {locations?.map((location, index) => (
                    <Checkbox
                      key={location?.id}
                      id={`location_${location?.label}`}
                      name={`location_${location?.label}`}
                      value={location?.label}
                      // isChecked={formik.values?.locations?.includes(
                      //   location?.label
                      // )}
                      isChecked={
                        selectedLocations?.find((lo) => lo.id == location.id)
                          ? true
                          : false
                      }
                      onChange={() =>
                        handleCheckboxLocationChange(location?.id)
                      }
                    >
                      {location?.label}
                    </Checkbox>
                  ))}
                </Box>
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            disabled={isLoding ? true : false}
            onClick={handleSubmit}
          >
            {isLoding ? <Spinner /> : "Update Data"}
          </Button>
          <Button onClick={() => onClose(false)}>close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default Edit;
