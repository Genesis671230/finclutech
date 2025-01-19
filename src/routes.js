import { Icon } from "@chakra-ui/react";
import { HiOutlineDocumentReport, HiUsers } from "react-icons/hi";
import {
  MdContacts,
  MdHome,
  MdLock
} from "react-icons/md";
// icon
import React from "react";
import { GrMapLocation, GrProjects } from "react-icons/gr";
import { LiaFileInvoiceSolid } from "react-icons/lia";
import { LuBuilding2 } from "react-icons/lu";
const Services = React.lazy(() => import("features/services/Services.jsx"));
const Entries = React.lazy(() => import("features/entries/Entries"));
const UserEntries = React.lazy(() => import("features/entries/UserEntries"));
// Admin Imports
const MainDashboard = React.lazy(() => import("views/admin/default"));
const UserDashboard = React.lazy(() => import("views/user/default"));

// My component




const User = React.lazy(() => import("features/users/Users"));
const UserView = React.lazy(() => import("views/admin/users/View"));




// Auth Imports
const SignInCentered = React.lazy(() => import("views/auth/signIn"));

const Signout = () => {
  localStorage.clear();
		sessionStorage.clear();
    window.location.href = "/auth/sign-in";
  return <div></div>;
}

const routes = [
  // ========================== Dashboard ==========================
  {
    name: "Dashboard",
    layout: "/admin",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: "Dashboard",
    layout: "/user",
    path: "/default",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: UserDashboard,
  },
  
  
  
  
  

  {
    name: "Services",
    layout: "/admin",
    both: true,
    path: "/services",
    icon: <Icon as={LiaFileInvoiceSolid} width="20px" height="20px" color="inherit" />,
    component: Services,
  },

  {
    name: "Entries",
    layout: "/admin",
    path: "/entries",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: Entries,
  },

  {
    name: "Entries",
    layout: "/user",
    path: "/entries",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: UserEntries,
  },


  {
    name: "Users",
    layout: "/admin",
    path: "/user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: User,
  },
  {
    name: "User View",
    both: true,
    layout: "/admin",
    under: "user",
    path: "/userView/:id",
    component: UserView,
  },
  



  // ========================== User layout ==========================

  // ========================== auth layout ==========================
  {
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: "Logout",
    layout: "/admin",
    both: true,
    path: "/sign-out",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: Signout,
  },
];

export default routes;
