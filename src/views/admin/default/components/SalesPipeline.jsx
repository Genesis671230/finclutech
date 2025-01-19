import {  Flex, Heading, IconButton } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";

import { HSeparator } from "components/separator/Separator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const mockData = [
  { stage: "Leads", value: 120 },
  { stage: "Test Drives", value: 86 },
  { stage: "Negotiations", value: 42 },
  { stage: "Closed Deals", value: 28 },
];

const SalesPipeline = () => {
  return (
    <Card>
      <Flex mb={3} alignItems="center" justifyContent="space-between">
        <Heading size="md">Sales Pipeline</Heading>
        <IconButton
          color="green.500"
          borderRadius="10px"
          size="md"
          icon={<ViewIcon />}
        />
      </Flex>
      <HSeparator />
      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#38A169" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SalesPipeline; 