import { Flex, Heading, IconButton, SimpleGrid } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";
import { HSeparator } from "components/separator/Separator";

const mockData = [
  { title: "Active Requests", value: "25", trend: "+5" },
  { title: "On-Time Completion", value: "85%", trend: "+2%" },
  { title: "Overdue Jobs", value: "5", trend: "-2" }
];

const ServiceSummary = () => {
  return (
    <Card>
      <Flex mb={3} alignItems="center" justifyContent="space-between">
        <Heading size="md">Service Summary</Heading>
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
            <h3 className="text-2xl font-bold">{item.value}</h3>
            <p className="text-sm text-gray-500">{item.title}</p>
            <span className="text-xs text-green-500">{item.trend}</span>
          </div>
        ))}
      </SimpleGrid>
    </Card>
  );
};

export default ServiceSummary; 