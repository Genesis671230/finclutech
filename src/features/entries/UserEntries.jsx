import {
    Badge, Box, Container, Grid, HStack, Icon, IconButton, Input, Menu,
    MenuButton, MenuItem, MenuList, Spinner, Stack, Stat, StatHelpText, StatLabel,
    StatNumber, Table, Tbody, Td, Text, Th, Thead, Tr, VStack
  } from "@chakra-ui/react";
  import { AnimatePresence, motion } from "framer-motion";
  import debounce from "lodash/debounce";
  import { useEffect, useMemo, useState } from "react";
  import {
    FiCheckCircle,
    FiChevronDown,
    FiChevronUp,
    FiClock,
    FiDownload,
    FiFilter,
    FiMoreVertical,
    FiRefreshCw,
    FiSearch
  } from "react-icons/fi";
  import { useDispatch, useSelector } from "react-redux";
  import { getApi } from "services/api";
  import ABCWalletLogo from "../../assets/img/ABCWallet.png";
  import ABCBankLogo from "../../assets/img/BankABCLogo.jpg";
  import XYZBankLogo from "../../assets/img/XYZBANK.webp";
  import FlashWalletLogo from "../../assets/img/flashwallet.webp";
  import GlobalBlankLogo from "../../assets/img/globalBank.jpg";
  import QuickPayLogo from "../../assets/img/quickpay.png";
  import {
    closeEntryDetailsModal,
    modalData,
    openEntryDetailsModal,
    setSelectedCustomer,
  } from "../../redux/slices/editModalSlice/editModalSlice";
  import EntryDetailsModal from "./components/EntryDetailsModal";
  
  // ChartJS.register(
  //   CategoryScale,
  //   LinearScale,
  //   BarElement,
  //   Title,
  //   Tooltip,
  //   Legend
  // );
  
  const bankLogos = {
    101: XYZBankLogo,
    102: ABCBankLogo,
    103: GlobalBlankLogo,
    501: ABCWalletLogo,
    502: QuickPayLogo,
    503: FlashWalletLogo,
  };
  
  const EntriesList = ({ entry, onClose }) => {
    const [customer, setCustomer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
  
    useEffect(() => {
      const fetchCustomer = async () => {
        try {
          const response = await getApi(`api/user/${entry.customerId}`);
          setCustomer(response.data);
        } catch (error) {
          console.error("Error fetching customer:", error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchCustomer();
    }, [entry.customerId]);
  
    if (isLoading) {
      return <Spinner />;
    }
  
    return (
      <Stack spacing={6}>
        <Box p={4} bg="gray.50" rounded="md">
          <Text fontWeight="bold" mb={2}>
            Customer Information
          </Text>
          <VStack align="start" spacing={2}>
            <Text>Name: {customer?.fullName}</Text>
            <Text>Email: {customer?.email}</Text>
            <Text>Phone: {customer?.phoneNumber}</Text>
          </VStack>
        </Box>
  
        <Box p={4} bg="gray.50" rounded="md">
          <Text fontWeight="bold" mb={2}>
            Entry Details
          </Text>
          <VStack align="start" spacing={2}>
            {Object.entries(entry.data).map(([key, value]) => (
              <HStack key={key} justify="space-between" w="full">
                <Text fontWeight="medium">{key.replace(/_/g, " ")}:</Text>
                <Text>{value}</Text>
              </HStack>
            ))}
          </VStack>
        </Box>
  
        <Box p={4} bg="gray.50" rounded="md">
          <Text fontWeight="bold" mb={2}>
            Metadata
          </Text>
          <VStack align="start" spacing={2}>
            <Text>Submitted: {new Date(entry.createdAt).toLocaleString()}</Text>
            <Text>
              Status:
              <Badge
                ml={2}
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
            </Text>
          </VStack>
        </Box>
      </Stack>
    );
  };
  
  const MotionBox = motion(Box);
  
  const ServiceCard = ({ service, isSelected, onClick }) => (
    <MotionBox
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      cursor="pointer"
      bg={isSelected ? "blue.500" : "white"}
      color={isSelected ? "white" : "gray.800"}
      p={6}
      rounded="xl"
      shadow="lg"
      onClick={onClick}
      borderWidth="1px"
      borderColor={isSelected ? "blue.500" : "gray.100"}
      transition="all 0.2s"
    >
      <VStack spacing={4}>
        <Icon as={service.icon} boxSize={8} />
        <Text fontWeight="bold" fontSize="lg">
          {service.name}
        </Text>
        <Text
          fontSize="sm"
          color={isSelected ? "whiteAlpha.800" : "gray.500"}
          textAlign="center"
        >
          {service.description}
        </Text>
        <Badge
          colorScheme={isSelected ? "white" : "blue"}
          px={3}
          py={1}
          rounded="full"
        >
          {service.entries_count} Entries
        </Badge>
      </VStack>
    </MotionBox>
  );
  
  const StatsCard = ({ label, value, icon, change }) => (
    <MotionBox
      whileHover={{ y: -2 }}
      p={6}
      bg="white"
      rounded="xl"
      shadow="lg"
      borderWidth="1px"
      borderColor="gray.100"
    >
      <Stat>
        <StatLabel color="gray.500">
          <HStack spacing={2}>
            <Icon as={icon} />
            <Text>{label}</Text>
          </HStack>
        </StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">
          {value}
        </StatNumber>
        {change && (
          <StatHelpText color={change > 0 ? "green.500" : "red.500"}>
            {change > 0 ? "↑" : "↓"} {Math.abs(change)}%
          </StatHelpText>
        )}
      </Stat>
    </MotionBox>
  );
  
  const getValueFromPath = (obj, path) => {
    return path
      .split(".")
      .reduce((acc, key) => (acc && acc[key] ? acc[key] : null), obj);
  };
  
  const EntriesTable = ({ entries, columns, onEntryClick, isLoading }) => {
    return (
      <Box
        bg="white"
        rounded="xl"
        shadow="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.100"
      >
        <Table>
          <Thead bg="gray.50">
            <Tr>
              {columns.map((column) => (
                <Th key={column.field} py={4}>
                  <HStack spacing={2}>
                    <Text>{column.label}</Text>
                    {column.sortable && (
                      <VStack spacing={0}>
                        <Icon as={FiChevronUp} boxSize={3} />
                        <Icon as={FiChevronDown} boxSize={3} />
                      </VStack>
                    )}
                  </HStack>
                </Th>
              ))}
              <Th width="50px"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {entries.map((entry) => (
              <Tr
                key={entry._id}
                _hover={{ bg: "gray.50" }}
                cursor="pointer"
                onClick={() => onEntryClick(entry)}
              >
                {columns.map((column) => {
                  console.log(
                    entry[column.field],
                    column.field,
                    "column get field datad"
                  );
                  return (
                    <Td key={column.field}>
                      {getValueFromPath(entry, column.field) || "N/A"}
                    </Td>
                  );
                })}
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <MenuList>
                      <MenuItem icon={<FiDownload />}>Export</MenuItem>
                      <MenuItem icon={<FiRefreshCw />}>Refresh</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  const Entries = () => {
    const dispatch = useDispatch();
    const {
      isEntryDetailsModalOpen,
      selectedEntry,
      selectedCustomer,
      activeTab,
    } = useSelector(modalData);
  
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortField, setSortField] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState("desc");
    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState(null);
    // Fetch services on mount
    useEffect(() => {
      const fetchServices = async () => {
        try {
          const response = await getApi("api/services");
          setServices(response.data);
        } catch (error) {
          console.error("Error fetching services:", error);
        }
      };
  
      fetchServices();
      fetchStats();

    }, []);
  
    const fetchStats = async () => {
      try {
        const customerId = JSON.parse(localStorage.getItem("user"));
        const response = await getApi(`api/services/stats/${customerId?._id}`);
        console.log(response.data, "total entries data");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
  
    useEffect(() => {
      if (!selectedService) return;
  
      const fetchEntries = async () => {
        const customerId = JSON.parse(localStorage.getItem("user"));
        setIsLoading(true);
        try {
          const response = await getApi(
            `api/services/${customerId._id}/userEntries?` +
              `page=${currentPage}&` +
              `serviceId=${selectedService.id}&` +
              `sortBy=${sortField}&` +
              `order=${sortOrder}&` +
              `search=${searchTerm}`
          );
          setEntries(response.data.entries);
          setTotalPages(response.data.pagination.pages);
        } catch (error) {
          console.error("Error fetching entries:", error);
        }
        //     finally {
        //     setIsLoading(false);
        // }
      };
  
      fetchEntries();
    }, [selectedService, currentPage, sortField, sortOrder, searchTerm]);
  
    const handleSearch = debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 500);
  
    const columns = useMemo(() => {
      if (!selectedService) return [];
  
      return [
        { field: "createdAt", label: "Date" },
        ...selectedService.required_fields.map((field) => ({
          field: `data.${field.name}`,
          label: field.label.en,
        })),
        { field: "status", label: "Status" },
      ];
    }, [selectedService]);
  
    const handleSort = (field) => {
      setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
      setSortField(field);
    };
  
    const handleEntryClick = async (entry) => {
      try {
        console.log(entry, "entry");
        const response = await getApi(`api/user/${entry.customerId}`);
        dispatch(setSelectedCustomer(response.data));
        dispatch(openEntryDetailsModal(entry));
      } catch (error) {
        console.error("Error fetching customer:", error);
      }
    };
  
    const handleServiceSelect = (service) => {
      setSelectedService(service);
      setCurrentPage(1);
    };
  
    const handleCloseModal = () => {
      setSearchTerm("");
      setCurrentPage(1);
  
      dispatch(closeEntryDetailsModal());
    };
  
    useEffect(() => {
      return () => {
        // Cleanup when component unmounts
        dispatch(closeEntryDetailsModal());
      };
    }, [dispatch]);
  
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="stretch">
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontSize="2xl" fontWeight="bold">
                Service Entries
              </Text>
              <Text color="gray.500">Manage and track all service entries</Text>
            </VStack>
            <HStack spacing={4}>
              <IconButton
                icon={<FiRefreshCw />}
                onClick={() => {
                }}
                isLoading={isLoading}
              />
              <IconButton
                icon={<FiDownload />}
                onClick={() => {
                }}
              />
            </HStack>
          </HStack>
  
          <Grid templateColumns="repeat(4, 1fr)" gap={6}>
            <StatsCard
              label="Total Entries"
              value={stats?.total || 0}
              icon={FiCheckCircle}
              change={5}
            />
            <StatsCard
              label="Pending"
              value={stats?.entries.filter(entry => entry.status === 'pending').length || 0}
              icon={FiClock}
              change={-2}
            />
          </Grid>
  
          <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={selectedService?.id === service.id}
                onClick={() => handleServiceSelect(service)}
              />
            ))}
          </Grid>
  
          {selectedService && (
            <AnimatePresence mode="wait">
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HStack mb={6} spacing={4}>
                  <Input
                    placeholder="Search entries..."
                    onChange={(e) => handleSearch(e.target.value)}
                    leftElement={<Icon as={FiSearch} color="gray.400" />}
                  />
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiFilter />}
                      variant="outline"
                    />
                    <MenuList></MenuList>
                  </Menu>
                </HStack>
  
                <EntriesTable
                  entries={entries}
                  columns={columns}
                  onEntryClick={handleEntryClick}
                  isLoading={isLoading}
                />
  
              
              </MotionBox>
            </AnimatePresence>
          )}
        </VStack>
  
        {isEntryDetailsModalOpen && (
          <EntryDetailsModal
            entry={selectedEntry}
            customer={selectedCustomer}
            isOpen={isEntryDetailsModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </Container>
    );
  };
  
  export default Entries;
  