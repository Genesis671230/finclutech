import { Flex, Heading, IconButton, Box, Badge } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";
import { HSeparator } from "components/separator/Separator";
import { Bell, Calendar, Package, AlertTriangle } from "lucide-react";

const mockData = [
  { 
    title: "Upcoming Deliveries",
    count: "3",
    icon: Package,
    color: "blue",
    description: "Vehicles ready for delivery today"
  },
  { 
    title: "Expiring Contracts",
    count: "2",
    icon: Calendar,
    color: "yellow",
    description: "Contracts expiring this week"
  },
  { 
    title: "Low Inventory Alert",
    count: "4",
    icon: AlertTriangle,
    color: "red",
    description: "Models below minimum stock level"
  }
];

const NotificationItem = ({ item }) => {
  const IconComponent = item.icon;
  const colorScheme = {
    blue: { bg: "blue.50", text: "blue.500", icon: "blue.400" },
    yellow: { bg: "yellow.50", text: "yellow.500", icon: "yellow.400" },
    red: { bg: "red.50", text: "red.500", icon: "red.400" }
  }[item.color];

  return (
    <Flex
      p={3}
      mb={2}
      bg={colorScheme.bg}
      borderRadius="lg"
      alignItems="center"
      className="hover:shadow-md transition-all duration-200"
    >
      <Box
        p={2}
        borderRadius="md"
        color={colorScheme.icon}
        className="mr-3"
      >
        <IconComponent size={20} />
      </Box>
      <Box flex="1">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="sm" color={colorScheme.text}>
            {item.title}
          </Heading>
          <Badge
            borderRadius="full"
            px={2}
            bg={colorScheme.text}
            color="white"
          >
            {item.count}
          </Badge>
        </Flex>
        {/* <Text fontSize="xs" color="gray.600" mt={1}>

</Text> */}
        <p>{item.description}</p>   
      </Box>
    </Flex>
  );
};

const Notifications = () => {
  return (
    <Card>
      <Flex mb={3} alignItems="center" justifyContent="space-between">
        <Flex alignItems="center" gap={2}>
          <Bell className="text-gray-600" size={20} />
          <Heading size="md">Notifications</Heading>
        </Flex>
        <IconButton
          color="green.500"
          borderRadius="10px"
          size="md"
          icon={<ViewIcon />}
        />
      </Flex>
      <HSeparator />
      <Box mt={4}>
        {mockData.map((item, index) => (
          <NotificationItem key={index} item={item} />
        ))}
      </Box>
    </Card>
  );
};

export default Notifications; 