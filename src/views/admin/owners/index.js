import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Grid,
  GridItem,
  Spinner,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { getApi } from "services/api";
import CheckTable from "./components/CheckTable";
import Add from "./Add";
import { useDispatch, useSelector } from "react-redux";
import {
  modalData,
  modalOpened,
  modalClosed,
} from "../../../redux/slices/editModalSlice/editModalSlice";

const Index = () => {
  const columns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: "Name", accessor: "name" },
    { Header: "Mobile Number", accessor: "mobileNo" },
    { Header: "Email Address", accessor: "email" },
    { Header: "Address", accessor: "address" },
    { Header: "Passport Number", accessor: "passportNo" },
    { Header: "Emirates ID", accessor: "emiratesId" },
    { Header: "Bank Name", accessor: "bankName" },
    { Header: "Bank Account No", accessor: "bankAccountNo" },
    { Header: "Created By", accessor: "createdBy" },
    { Header: "Action", accessor: "action", isSortable: false, width: 10 },
  ];

  const size = "lg";
  const [data, setData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [add, setAdd] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();

  const { rowData, isOpen } = useSelector(modalData);
  const handleClick = () => {
    dispatch(modalOpened());
  };
  const handleClose = () => {
    dispatch(modalClosed());
  };
  const fetchData = useMemo(
    () => async () => {
      setIsLoding(true);
      let result = await getApi(
        user.role === "admin" ? "api/owner/" : `api/owner/?createBy=${user._id}`
      );
      setData(result.data);
      setIsLoding(false);
    },
    [data, isLoding]
  );

  
  useEffect(() => {
    fetchData();
  }, []);
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
      {/* <CheckTable columnsData={columns} tableData={data} /> */}
      <CheckTable
        isLoding={isLoding}
        columnsData={columns}
        isOpen={isOpen}
        tableData={data}
        fetchData={fetchData}
      />
      {/* Add Form */}
      {isOpen ? <Add isOpen={isOpen} size={size} onClose={handleClose} /> : null}
    </div>
  );
};

export default Index;
