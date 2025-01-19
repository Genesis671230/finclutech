import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  HStack,
  VStack,
  Text,
  Badge,
  Avatar,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Divider,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiUser, FiCalendar, FiFileText, FiActivity, FiPhone } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { 
  modalData,
  setActiveTab,
  closeEntryDetailsModal,
} from "../../../redux/slices/editModalSlice/editModalSlice";

const MotionBox = motion(Box);

const DetailCard = ({ title, children }) => (
  <MotionBox
    whileHover={{ y: -2 }}
    p={6}
    bg="white"
    rounded="xl"
    shadow="lg"
    borderWidth="1px"
    borderColor="gray.100"
  >
    <Text fontSize="lg" fontWeight="semibold" mb={4}>
      {title}
    </Text>
    {children}
  </MotionBox>
);

const EntryDetailsModal = ({ entry, customer, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector(modalData);

  useEffect(() => {
    return () => {
      dispatch(setActiveTab(0));
    };
  }, [dispatch]);

  const tabData = [
    { icon: FiFileText, label: "Entry Details" },
    { icon: FiUser, label: "Customer Info" },
    { icon: FiActivity, label: "Activity" },
  ];

  const handleTabChange = (index) => {
    dispatch(setActiveTab(index));
  };

  const handleClose = () => {
    dispatch(setActiveTab(0));
    onClose();
  };
  console.log(entry,"our entry",customer,"our customer");

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="4xl"
      motionPreset="slideInBottom"
      closeOnOverlayClick={true}
      closeOnEsc={true}
      isCentered
      onCloseComplete={() => {
        dispatch(closeEntryDetailsModal());
      }}
    >
      <ModalOverlay 
        bg="blackAlpha.300" 
        backdropFilter="blur(10px)"
        onClick={handleClose}
      />
      <ModalContent 
        rounded="2xl" 
        overflow="hidden"
        bg="gray.50"
        onClick={e => e.stopPropagation()}
      >
        <ModalBody p={0}>
          <HStack align="stretch" spacing={0} h="600px">
            {/* Sidebar */}
            <VStack 
              w="240px" 
              bg="white" 
              p={6} 
              spacing={6}
              borderRightWidth="1px"
              borderColor="gray.200"
            >
              <VStack spacing={4} align="center" w="full">
                <Avatar 
                  size="xl"
                  name={customer?.fullName||customer?.firstName+" "+customer?.lastName||"N/A"}
                  src={customer?.profilePicture}
                />
                <VStack spacing={1}>
                  <Text fontWeight="bold" fontSize="lg">
                    {customer?.fullName||customer?.firstName+" "+customer?.lastName||"N/A"}
                  </Text>
                  <Badge colorScheme="blue" rounded="full" px={3}>
                    {customer?.role||"N/A"}
                  </Badge>
                </VStack>
              </VStack>

              <Divider />

              <VStack spacing={4} w="full">
                {tabData.map((tab, index) => (
                  <HStack
                    key={index}
                    w="full"
                    py={2}
                    px={4}
                    cursor="pointer"
                    rounded="lg"
                    spacing={3}
                    onClick={() => handleTabChange(index)}
                    bg={activeTab === index ? "blue.50" : "transparent"}
                    color={activeTab === index ? "blue.500" : "gray.600"}
                    _hover={{ bg: "blue.50" }}
                  >
                    <Icon as={tab.icon} boxSize={5} />
                    <Text fontWeight="medium">{tab.label}</Text>
                  </HStack>
                ))}
              </VStack>
            </VStack>

            {/* Content */}
            <Box flex={1} p={6} overflowY="auto">
                <Tabs index={activeTab} onChange={handleTabChange}>    
                    <TabList>
                        <Tab>Entry Details</Tab>
                        <Tab>Customer Info</Tab>
                        <Tab>Activity</Tab>
                    </TabList>
              <TabPanels>
                {/* Entry Details Panel */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={6}>
                      <Stat>
                        <StatLabel>Service</StatLabel>
                        <StatNumber>{entry?.serviceName}</StatNumber>
                        <StatHelpText>
                          <Icon as={FiCalendar} mr={2} />
                          {new Date(entry?.createdAt).toLocaleDateString()}
                        </StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel>Status</StatLabel>
                        <StatNumber>
                          <Badge
                            colorScheme={
                              entry?.status === "completed" ? "green" :
                              entry?.status === "pending" ? "yellow" : "red"
                            }
                            fontSize="md"
                            px={3}
                            py={1}
                          >
                            {entry?.status}
                          </Badge>
                        </StatNumber>
                      </Stat>
                    </HStack>

                    <DetailCard title="Entry Data">
                      <VStack spacing={4} align="stretch">
                        {Object.entries(entry?.data || {}).map(([key, value]) => (
                          <HStack 
                            key={key} 
                            justify="space-between"
                            p={3}
                            bg="gray.50"
                            rounded="lg"
                          >
                            <Text fontWeight="medium" color="gray.600">
                              {key.replace(/_/g, ' ')}
                            </Text>
                            <Text>{value}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </DetailCard>
                  </VStack>
                </TabPanel>

                {/* Customer Info Panel */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <DetailCard title="Contact Information">
                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Icon as={FiUser} color="blue.500" />
                          <Text fontWeight="medium">Email:</Text>
                          <Text>{customer?.email || 'N/A'}</Text>
                        </HStack>
                        <HStack>
                          <Icon as={FiPhone} color="blue.500" />
                          <Text fontWeight="medium">Phone:</Text>
                          <Text>{customer?.phoneNumber || 'N/A'}</Text>
                        </HStack>
                      </VStack>
                    </DetailCard>

                    <DetailCard title="Account Details">
                      <VStack spacing={4} align="stretch">
                        <HStack>
                          <Text fontWeight="medium">Employee ID:</Text>
                          <Text>{customer?.employeeId || 'N/A'}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="medium">Total Entries:</Text>
                            <Text>{customer?.entryCount || 0}</Text>
                        </HStack>
                        <HStack>
                          <Text fontWeight="medium">Role:</Text>
                            <Text>{customer?.role || "N/A"}</Text>
                        </HStack>

                      </VStack>
                    </DetailCard>
                  </VStack>
                </TabPanel>

                {/* Activity Panel */}
                <TabPanel>
                  <DetailCard title="Recent Activity">
                    <VStack spacing={4} align="stretch">
                      {entry?.metadata && (
                        <>
                          <HStack justify="space-between">
                            <Text color="gray.600">Submitted From</Text>
                            <Text>{entry?.metadata?.ipAddress || 'N/A'}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.600">Browser</Text>
                            <Text>{entry?.metadata?.userAgent || 'N/A'}</Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text color="gray.600">Last Updated</Text>
                            <Text>
                              {new Date(entry?.updatedAt).toLocaleString() || 'N/A'}
                            </Text>
                          </HStack>
                        </>
                      )}
                    </VStack>
                  </DetailCard>
                </TabPanel>
              </TabPanels>
              </Tabs>

            </Box>
          </HStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EntryDetailsModal; 