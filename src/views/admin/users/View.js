import {
  ChevronDownIcon,
  DeleteIcon,
  EditIcon,
  EmailIcon,
  PhoneIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
  Badge,
  Stack,
  HStack,
  VStack,
  useColorModeValue,
  Icon,
  Avatar,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiUser, FiHash, FiActivity } from "react-icons/fi";
import Card from "components/card/Card";
import Spinner from "components/spinner/Spinner";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

const StatCard = ({ label, value, icon }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      p={6}
      bg={bgColor}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={borderColor}
      shadow="lg"
    >
      <HStack spacing={4}>
        <Icon as={icon} boxSize={8} color="blue.500" />
        <VStack align="start" spacing={1}>
          <Text fontSize="sm" color="gray.500">
            {label}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {value}
          </Text>
        </VStack>
      </HStack>
    </MotionBox>
  );
};

const View = () => {
  const param = useParams();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getApi("api/user/", param.id);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [param.id]);

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Stack spacing={8}>
      {/* Hero Section */}
      <MotionFlex
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bg={bgColor}
        p={8}
        borderRadius="2xl"
        shadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
      >
        <HStack spacing={6}>
          <Avatar
            size="xl"
            name={data?.fullName}
            src={data?.profilePicture}
            bg="blue.500"
          />
          <VStack align="start" spacing={2}>
            <Heading size="lg">{data?.fullName || "-"}</Heading>
            <Badge
              size="lg"
              colorScheme={
                data?.role === "admin"
                  ? "red"
                  : data?.role === "manager"
                  ? "purple"
                  : "blue"
              }
              px={3}
              py={1}
              borderRadius="full"
            >
              {data?.role?.toUpperCase() || "-"}
            </Badge>
            <HStack spacing={4} color="gray.500">
              <HStack>
                <EmailIcon />
                <Text>{data?.email}</Text>
              </HStack>
              <HStack>
                <PhoneIcon />
                <Text>{data?.phoneNumber}</Text>
              </HStack>
            </HStack>
          </VStack>
        </HStack>

        <HStack spacing={4} mt={{ base: 4, md: 0 }}>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              rightIcon={<ChevronDownIcon />}
              colorScheme="blue"
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem icon={<EditIcon />}>Edit Profile</MenuItem>
              {data?.role !== "admin" && (
                <MenuItem icon={<DeleteIcon />} color="red.500">
                  Delete Account
                </MenuItem>
              )}
            </MenuList>
          </Menu>
          <Link to="/admin/user">
            <Button leftIcon={<IoIosArrowBack />} colorScheme="gray">
              Back
            </Button>
          </Link>
        </HStack>
      </MotionFlex>

      {/* Stats Grid */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap={6}
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <StatCard
          label="Employee ID"
          value={data?.employeeId}
          icon={FiHash}
        />
        <StatCard
          label="Total Entries"
          value={data?.entryCount || 0}
          icon={FiActivity}
        />
        <StatCard
          label="Account Status"
          value={data?.deleted ? "Inactive" : "Active"}
          icon={FiUser}
        />
      </Grid>

      {/* Recent Entries */}
      {data?.entries?.length > 0 && (
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          bg={bgColor}
          p={6}
          borderRadius="xl"
          borderWidth="1px"
          borderColor={borderColor}
          shadow="lg"
        >
          <HStack mb={6}>
            <TimeIcon boxSize={5} color="blue.500" />
            <Heading size="md">Recent Entries</Heading>
          </HStack>
          <Stack spacing={4}>
            {data.entries.slice(0, 5).map((entry, index) => (
              <MotionBox
                key={index}
                whileHover={{ x: 5 }}
                p={4}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                _hover={{ bg: "gray.50" }}
              >
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="semibold">{entry.serviceName}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </Text>
                    {/* Dynamically render data fields */}
                    {entry.data && Object.entries(entry.data).map(([key, value]) => (
                      <Text key={key} fontSize="sm" color="gray.600">
                        {`${key.replace(/_/g, ' ')}: ${value || "N/A"}`}
                      </Text>
                    ))}
                  </VStack>
                  <Badge
                    colorScheme={
                      entry.status === "completed"
                        ? "green"
                        : entry.status === "pending"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {entry.status}
                  </Badge>
                </HStack>
              </MotionBox>
            ))}
          </Stack>
        </MotionBox>
      )}
    </Stack>
  );
};

export default View;
