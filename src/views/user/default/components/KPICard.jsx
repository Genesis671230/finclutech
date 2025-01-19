import { Flex, Text, Icon, Box, VStack } from "@chakra-ui/react";
import { ArrowUp, ArrowDown } from "lucide-react";
import Card from "components/card/Card.js";

const KPICard = ({ title, value, trend, subtitle, metric, isPositive, additionalDetails }) => {
  return (
    <Card className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
      <div className="relative">
        <h1 className="text-4xl font-bold">{value}</h1>
        <span 
          className={`absolute top-0 right-0 flex gap-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isPositive ? <ArrowUp /> : <ArrowDown />} {Math.abs(trend)}%
        </span>
      </div>
      <h2 className="text-md font-light mb-6 text-gray-500">{title}</h2>
      <div>
        <h2 className="text-sm font-light mb-4 text-gray-500">{metric}</h2>
      </div>
      <Box mt={4} p={3} borderWidth={1} borderColor="gray.200" borderRadius="md" bg="gray.50">
        <VStack align="start" spacing={2}>
          {additionalDetails.map((detail, index) => (
            <Flex key={index} alignItems="center" p={2} borderRadius="md" _hover={{ bg: "gray.100" }}>
              <Icon as={detail.icon} boxSize={5} color="gray.600" />
              <Text ml={2} fontSize="sm" color="gray.700">{detail.text}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>
    </Card>
  );
};

export default KPICard; 