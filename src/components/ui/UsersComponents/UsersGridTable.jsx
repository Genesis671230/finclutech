import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
// import 'ag-grid-enterprise';
import { AgGridReact } from "ag-grid-react";
// import { getSelectedUsersId, setUserIds } from "features/Users/UserSlice";
import { selectUsers } from "features/users/userSlice";
import { useCallback, useMemo, useRef, useState } from "react";
import { IoDownload } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { getApi } from "services/api";
import {
  modalData
} from "../../../redux/slices/editModalSlice/editModalSlice.js";
import { Button } from "../button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import {
  Drawer,
  DrawerOverlay
} from "../drawer";

export const NoOfPayment = (props) => {
  const payments = props.valueFormatted ? props.valueFormatted : props.value;
  const total = props.data.total;
  console.log(props, "payments and total");
  return (
    <span className="total-value-renderer">
      {payments?.map((payment, index) => (
        <div key={index}>
          <span>{payment.id}</span>
          <span>{payment.amount}</span>
        </div>
      ))}
      <button onClick={() => alert(`${total} medals won!`)}>
        Push For Total
      </button>
    </span>
  );
};

var checkboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};

var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};

const UsersGridTable = ({userlist}) => {
  const [selectedRowData, setSelectedRowData] = useState(null); // State to hold selected row data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const gridRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [users, setUsers] = useState([]);
  // const selectedUsersId = useSelector(getSelectedUsersId);
  // const users = useSelector(selectUsers);
  console.log(users,"users")

  const handleCheckboxSelection = (params) => {
    const selectedIds = params.api.getSelectedRows().map((row) => row._id);
    // dispatch(setUserIds(selectedIds));
  };

  const handleFileClick = (files) => {
    setSelectedFiles(files);
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const containerStyle = useMemo(() => ({ width: "100%", height: "68vh" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const user = JSON.parse(localStorage.getItem("user"));

  const components = useMemo(
    () => ({
      noOfPayments: NoOfPayment,
      // reactComponent: ReactComponent,
    }),
    []
  );


  const onRowClicked = (event) => {
    setSelectedRowData(event.data); // Capture the clicked row's data
  };
  const handleOpenModal = (event) => {
    setSelectedRowData(event.data);
    setIsModalOpen(true);
    // dispatch(modalOpened())
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "_id",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      editable: false,
      onCellValueChanged: (event) => {
        console.log(event, "event");
        setSelectedRowData(event.data);
        // setUserIds(event.data);
      },
      minWidth: 300,
    },


    
    {
      field: "firstName",
      headerName: "FirstName",
      editable: false,
      filter: "agNumberColumnFilter",
      minWidth: 100,
    },
    {
      field: "lastName",
      headerName: "LastName",
      editable: false,
      cellEditor: "agTextCellEditor",
      filter: "agTextColumnFilter",
      minWidth: 150,
    },
    {
      field: "email",
      headerName: "Email",
      editable: false,
      filter: "agNumberColumnFilter",
      minWidth: 100,
    },
   
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      editable: false,
      cellEditor: "agTextCellEditor",
      filter: "agNumberColumnFilter",
      minWidth: 150,
    },
    
    {
      field: "entryCount",
      headerName: "Entry Count",
      editable: false,
      cellEditor: "agTextCellEditor",
      filter: "agNumberColumnFilter",
      minWidth: 150,
    },

    {
      field: "role",
      headerName: "Role",
      editable: false,
      cellEditor: "agTextCellEditor",
      filter: "agNumberColumnFilter",
      minWidth: 150,
    },

  ]);

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Group",
      minWidth: 170,
      field: "athlete",
      valueGetter: (params) => {
        if (params.node.group) {
          return params.node.key;
        } else {
          return params.data[params.colDef.field];
        }
      },
      headerCheckboxSelection: true,
      cellRenderer: "agGroupCellRenderer",
      cellRendererParams: {
        checkbox: true,
      },
    };
  }, []);

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      enableRowGroup: true,
      enablePivot: true,
      enableValue: true,
      floatingFilter: true,
      sortable: true,
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getApi(
        user.role === "admin" ? "api/user/" : `api/user/?createdBy=${user._id}`
      );
      setUsers(response.data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch processed Users");
    }
  };

  const onGridReady = useCallback(async (params) => {
    // fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     console.log(data);
    await fetchUsers();
  }, []);

  const dispatch = useDispatch();
  const { isOpen } = useSelector(modalData);

  const handleClose = () => {
    setIsModalOpen(false);
    // dispatch(modalClosed());
  };
  const handleOpen = () => {
    // dispatch(modalOpened());
  };
  const exportAsExcel = () => {
    gridRef.current.api?.exportDataAsCsv();
  };

  return (
    <>
      <Dialog open={isModalVisible}>
        {/* <DialogTrigger asChild>
          <Button variant="outline">Share</Button>
        </DialogTrigger> */}
        <DrawerOverlay onClick={handleCancel} />
        <DialogContent className="sm:min-w-[80vw] min-h-[80vh]">
          <DialogHeader>
            <DialogTitle>User Files</DialogTitle>
            <DialogDescription>
              Download and view the User files.
            </DialogDescription>
          </DialogHeader>
          <div className="flex h-full flex-row flex-wrap overflow-y-scroll gap-6  w-full   items-center space-x-2">
            {selectedFiles?.map((item, index) => {
              const fileName = item.split("/");
              return item.includes("pdf") ? (
                <a href={item} download={fileName[fileName.length - 1]}>
                  Download
                </a>
              ) : (
                <img
                  // onClick={() => handleFileClick(fileName)}
                  className="w-[30rem] h-[20rem] object-cover"
                  src={item}
                  alt=""
                  srcset=" "
                />
              );
            })}
            {/* <Button type="submit" size="sm" className="px-3">
              <span className="sr-only">Copy</span>
            </Button> */}
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button onClick={handleCancel} type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex justify-end">
        <div className="flex text-center items-center px-2 m-2 mr-0 cursor-pointer group self-end rounded-sm bg-white w-fit shadow-md justify-end">
          <IoDownload
            className="text-3xl mb-2 mr-2 text-gray-900 group-hover:scale-110 cursor-pointer"
            onClick={exportAsExcel}
          />{" "}
          <p className="text-center">Export</p>
        </div>
      </div>

      <div style={containerStyle}>
        <div style={gridStyle} className={"ag-theme-quartz"}>
          <AgGridReact
            ref={gridRef}
            rowData={users}
            columnDefs={columnDefs}
            // autoGroupColumnDef={autoGroupColumnDef}
            defaultColDef={defaultColDef}
            components={components}
            suppressRowClickSelection={true}
            groupSelectsChildren={true}
            rowSelection={"multiple"}
            editType={"fullRow"}
            rowGroupPanelShow={"always"}
            pivotPanelShow={"always"}
            pagination={true}
            onGridReady={onGridReady}
            alwaysShowHorizontalScroll={true}
            alwaysShowVerticalScroll={true}
            onRowClicked={onRowClicked}
            onSelectionChanged={handleCheckboxSelection}
          />
        </div>

        <Drawer
          open={isModalOpen}
          direction="right"
          className="overflow-scroll"
        >
          <DrawerOverlay onClick={handleClose} />
          {/* <DrawerTrigger asChild>
        <Button
          onClick={handleOpen}
          variant="outline"
          className="bg-blue-700 text-white"
        >
          <BiPlus /> Add User
        </Button>
      </DrawerTrigger> */}
          {/* <DrawerContent className="right-0 z-50 left-auto h-full w-[45rem] overflow-auto">
            <div className="mx-auto w-full">
              <IconButton
                className="float-end"
                onClick={handleClose}
                icon={<CloseIcon />}
              />
              <DrawerHeader className="text-left">
                <DrawerTitle>Edit User</DrawerTitle>
                <DrawerDescription>
                  Edit a User. Click save when you're done.
                </DrawerDescription>
              </DrawerHeader>
              <UserEdit
                className="px-4"
                UserRowData={selectedRowData}
                setIsModalOpen={setIsModalOpen}
              />
            </div>
          </DrawerContent> */}
        </Drawer>
      </div>
    </>
  );
};

export default UsersGridTable;
