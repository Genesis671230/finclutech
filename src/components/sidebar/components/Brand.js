import React from "react";

// Chakra imports
import { Flex, Heading, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";
import logo from "../../../assets/img/logo/finclutechLogo.png";
export function SidebarBrand() {
  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align="center" direction="column" justify="center">
      <Flex  justify="center" align="center" >
        <Heading mb={5}>
          <img src={logo} className="object-cover w-full h-10" />
        </Heading>
        <Heading color={"white"} className="text-2xl text-center" mb={5}>Finclutech</Heading>
      </Flex>
      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
