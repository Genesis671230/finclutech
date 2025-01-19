import { CloseIcon, PhoneIcon } from "@chakra-ui/icons";
import Dropzone from "components/Dropzone";
import Spinner from "components/spinner/Spinner";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MdOutlineRemoveRedEye, MdUpload } from "react-icons/md";
import { RiEyeCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { postApi } from "services/api";
import { authorities,locations } from "constant";
import {
  Box,
  Button,
  Checkbox,
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
} from "@chakra-ui/react";
import { getApi } from "services/api";


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



const AddUser = (props) => {
  const { onClose, isOpen, fetchData } = props;
  console.log(props);
  const [isLoding, setIsLoding] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedAuthorities, setSelectedAuthorities] = useState([]);


  const [show, setShow] = React.useState(false);
  const showPass = () => setShow(!show);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const brandColor = useColorModeValue("brand.500", "white");
  const textColorSecondary = "gray.400";

  const [users, setUsers] = useState([]);
  
  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: userSchema,
    onSubmit: (values, { resetForm }) => {
      console.log(values);
      AddData();
      // resetForm();
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
    resetForm,
  } = formik;

  

  const handleCheckboxAuthorityChange = (authority_id) => {
    const findAuthority = selectedAuthorities.find(
      (selected) => selected?.id === authority_id
    );

    if (findAuthority) {
      setSelectedAuthorities((prevSelected) =>
        prevSelected.filter((selected) => selected.id !== authority_id)
      );
    } else {
      setSelectedAuthorities((prevSelected) => [
        ...prevSelected,
        authorities.find((selected) => selected?.id === authority_id),
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
        locations.find((selected) => selected?.id === location_id),
      ]);
    }
  };

  const AddData = async () => {
    try {
      setIsLoding(true);
      const formData = new FormData();

      if (values?.profilePicture?.length > 0) {
        values?.profilePicture?.forEach((file) => {
          formData?.append("profilePicture", file);
        });
      }

      if (values?.offerLetter?.length > 0) {
        values?.offerLetter?.forEach((file) => {
          formData?.append("offerLetter", file);
        });
      }

      if (values?.passportCopy?.length > 0) {
        values?.passportCopy?.forEach((file) => {
          formData?.append("passportCopy", file);
        });
      }

      if (values?.visaPage?.length > 0) {
        values?.visaPage?.forEach((file) => {
          formData?.append("visaPage", file);
        });
      }

      if (values?.emiratesId?.length > 0) {
        values?.emiratesId?.forEach((file) => {
          formData?.append("emiratesId", file);
        });
      }

      if (values?.labourCard?.length > 0) {
        values?.labourCard?.forEach((file) => {
          formData?.append("labourCard", file);
        });
      }

      formData.append("locations", JSON.stringify(selectedLocations));
      formData.append("authorities", JSON.stringify(selectedAuthorities));

      const res = Object.entries(values);
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
      });

      let response = await postApi("api/user/register", formData);

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

  const fetchAllUsers = async () => {
    try {
      setIsLoding(true);
      let result = await getApi("api/user/");
      console.log(result,"list all the users");
      setUsers(result.data?.user);
      setIsLoding(false);
    } catch (error) {
      setIsLoding(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);
  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxWidth={"40vw"}>
        <ModalHeader justifyContent="space-between" display="flex">
          Add User
          <IconButton onClick={onClose} icon={<CloseIcon />} />
        </ModalHeader>
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
                  children={<PhoneIcon color="gray.300" borderRadius="16px" />}
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
                  Reporting To
                </FormLabel>
                <Select
                  value={values.assignTo}
                  name="reportingTo"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  fontWeight="500"
                  placeholder={"Select Reporting To User"}
                  borderColor={
                    errors.assignTo && touched.assignTo ? "red.300" : null
                  }
                >
                  {users?.map((user) => (
                    <>
                      <option value={user._id}>
                        {user.name}
                      </option>
                    </>
                  ))}
                </Select>
                <Text mb="10px" color={"red"}>
                  {errors.assignTo && touched.assignTo && errors.assignTo}
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
                borderColor={errors.email && touched.email ? "red.300" : null}
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
                borderColor={errors.target && touched.target ? "red.300" : null}
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
                <InputRightElement display="flex" alignItems="center" mt="4px">
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
                <InputRightElement display="flex" alignItems="center" mt="4px">
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
                        <Flex justify="center" mx="auto" mb="12px">
                          <Text
                            fontSize="md"
                            fontWeight="700"
                            color={brandColor}
                          >
                            Upload Profile Picture
                          </Text>
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
                {/* <Input type="file" onF name="offerLetter"  accept=".jpg, .jpeg, .png, .pdf" /> */}
                {/* <Upload
                  onFileSelect={(file) => setFieldValue("offerLetter", file)}
                /> */}

                {/* <GridItem colSpan={{ base: 12, "2xl": 5 }}> */}
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
                        <Text fontSize="md" fontWeight="700" color={brandColor}>
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
                        <Text fontSize="md" fontWeight="700" color={brandColor}>
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
                        <Text fontSize="md" fontWeight="700" color={brandColor}>
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
                        <Text fontSize="md" fontWeight="700" color={brandColor}>
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
                        <Text fontSize="md" fontWeight="700" color={brandColor}>
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
                borderColor={errors.status && touched.status ? "red.300" : null}
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
                  {authorities.map((authority, index) => (
                    <Checkbox
                      key={authority?.id}
                      id={`authority_${authority?.label}`}
                      name={`authority_${authority?.label}`}
                      value={authority?.label}
                      // isChecked={formik.values?.authorities?.includes(
                      //   authority?.label
                      // )}
                      isChecked={
                        selectedAuthorities.find((au) => au.id == authority.id)
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
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            variant="brand"
            // disabled={isLoding ? true : false}
            onClick={() => formik.handleSubmit()}
          >
            {isLoding ? <Spinner /> : "Add User"}
          </Button>
          <Button
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
          >
            Clear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddUser;
