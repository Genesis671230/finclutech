import { Flex, Heading, IconButton, SimpleGrid } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";
import { HSeparator } from "components/separator/Separator";

const mockData = [
  { title: "New Customers", value: "30", icon: "👥" },
  { title: "Top Customers", value: "5", icon: "⭐" },
  { title: "Follow-Ups Due", value: "10", icon: "📅" }
];

const CustomerEngagement = () => {
  return (
    <Card>
      <Flex mb={3} alignItems="center" justifyContent="space-between">
        <Heading size="md">Customer Engagement</Heading>
        <IconButton
          color="green.500"
          borderRadius="10px"
          size="md"
          icon={<ViewIcon />}
        />
      </Flex>
      <HSeparator />
      <SimpleGrid columns={3} spacing={4} mt={4}>
        {mockData.map((item, index) => (
          <div key={index} className="text-center">
            <span className="text-2xl mb-2">{item.icon}</span>
            <h3 className="text-xl font-bold">{item.value}</h3>
            <p className="text-sm text-gray-500">{item.title}</p>
          </div>
        ))}
      </SimpleGrid>
    </Card>
  );
};

export default CustomerEngagement; 