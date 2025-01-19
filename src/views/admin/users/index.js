import { AddIcon } from "@chakra-ui/icons";
import { Button, Grid, GridItem, useDisclosure } from "@chakra-ui/react";
import CheckTable from "./components/CheckTable";
import AddUser from "./Add";
import { useEffect, useState } from "react";
import { getApi } from "services/api";

const Index = () => {
  const [add, setAdd] = useState(false);
  const [data, setData] = useState();
  const [isLoding, setIsLoding] = useState(false);

  const columns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
    },
    { Header: "FirstName", accessor: "firstName" },
    { Header: "LastName", accessor: "lastName" },
    { Header: "Email Id", accessor: "email" },
    { Header: "Phone Number", accessor: "phoneNumber" },
    { Header: "Role", accessor: "role" },
    // { Header: "Action", accessor: "action", isSortable: false, width: 10 },
  ];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const size = "lg";

  const handleClick = () => {
    setAdd(true);
  };

  console.log(data);
  const fetchData = async () => {
    try {
      setIsLoding(true);
      let result = await getApi("api/user/");
      console.log(result);
      setData(result.data);
      setIsLoding(false);
    } catch (error) {
      setIsLoding(false);
      console.log(error);
    }
  };
  const handleClose = () => {
    setAdd(false);
  };

  useEffect(() => {
    fetchData();
  }, [add]);

  return (
    <div>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={1}>
        <GridItem colStart={6} textAlign={"right"}>
          <Button
            onClick={() => handleClick()}
            leftIcon={<AddIcon />}
            variant="brand"
          >
            Add
          </Button>
        </GridItem>
      </Grid>
      <CheckTable isOpen={add} columnsData={columns} />
      {/* Add Form */}
      {add ? (
        <AddUser isOpen={add} fetchData={fetchData} onClose={handleClose} />
      ) : null}
    </div>
  );
};

export default Index;
