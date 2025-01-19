import { Flex, Heading, IconButton } from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import Card from "components/card/Card.js";

import { HSeparator } from "components/separator/Separator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const mockData = [
  { name: "SUVs", value: 45 },
  { name: "Sedans", value: 30 },
  { name: "Trucks", value: 15 },
  { name: "Luxury", value: 10 },
];

const COLORS = ["#38A169", "#3182CE", "#E53E3E", "#805AD5"];

const InventoryStatus = () => {
  return (
    <Card>
      <Flex mb={3} alignItems="center" justifyContent="space-between">
        <Heading size="md">Inventory Status</Heading>
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
          <PieChart>
            <Pie
              data={mockData}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default InventoryStatus; 