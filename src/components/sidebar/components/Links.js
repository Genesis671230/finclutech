/* eslint-disable */
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import {
  AbsoluteCenter,
  Box,
  Divider,
  Flex,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("white", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("white", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");
  let activeBg = useColorModeValue("#33405B", "#33405B"); 
  let inActiveBg = useColorModeValue("#1A202C", "#1A202C");

  const user = JSON.parse(localStorage.getItem("user"));

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight="bold"
              mx="auto"
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt="18px"
              pb="12px"
              key={index}
            >
              {/* {route.name} */}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (
        (!route.under && user?.role && route.layout === `/${user.role}`) ||
        (`/admin` && !route.under && user?.role && route.both === true)
      ) {
        return (
          <NavLink
            key={index}
            to={route.both === true ? route.path : route.layout + route.path}
          >
            {route.separator && (
              <Box position="relative" margin="20px 0">
                <Divider />
                <AbsoluteCenter
                  textTransform={"capitalize"}
                  bg="white"
                  width={"max-content"}
                  padding="0 10px"
                  textAlign={"center"}
                >
                  {route.separator}
                </AbsoluteCenter>
              </Box>
            )}
            {route.icon ? (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py="5px"
                  ps="10px"
                >
                  <Flex
                    w="100%"
                    alignItems="center"
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? activeBg
                        : inActiveBg
                    }
                    padding={2}
                    borderRadius={4}
                    justifyContent="center"
                  >
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me="18px"
                    >
                      {route.icon}
                    </Box>
                    <Text
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }
                    >
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h="36px"
                    w="4px"
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius="5px"
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py="5px"
                  ps="10px"
                >
                  <Text
                    me="auto"
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }
                  >
                    {route.name}
                  </Text>
                  <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
