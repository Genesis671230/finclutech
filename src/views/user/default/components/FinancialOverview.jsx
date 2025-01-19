import { Flex, Heading, IconButton } from "@chakra-ui/react";
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
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

const FinancialOverview = () => {
  const [summaryData, setSummaryData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryResponse = await axios.get('/api/entries/summary'); // Adjust the endpoint as necessary
        const breakdownResponse = await axios.get('/api/entries/breakdown'); // Adjust the endpoint as necessary
        setSummaryData(summaryResponse.data);
        setBreakdownData(breakdownResponse.data);
      } catch (error) {
        console.error('Error fetching financial overview:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <Flex mb={3} alignItems="center" justifyContent="space-between">
        <Heading size="md">Financial Overview</Heading>
        <IconButton
          color="green.500"
          borderRadius="10px"
          size="md"
          icon={<ViewIcon />}
        />
      </Flex>
      <HSeparator />
      <div className="grid grid-cols-2 gap-4 mt-4">
        {summaryData.map((item, index) => (
          <div key={index} className="text-center">
            <h3 className="text-xl font-bold">{item.value}</h3>
            <p className="text-sm text-gray-500">{item.title}</p>
          </div>
        ))}
      </div>
      <div className="h-[200px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={breakdownData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4FD1C5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default FinancialOverview; 