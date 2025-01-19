import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
// import 'ag-grid-enterprise';
import { AgGridReact } from "ag-grid-react";
import { selectContacts } from "features/contacts/contactSlice";
import { selectLeads } from "features/Leads/leadSlice";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { getApi } from "services/api";

var checkboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};

var headerCheckboxSelection = function (params) {
  // we put checkbox on the name if we are not doing grouping
  return params.api.getRowGroupColumns().length === 0;
};

const ContactsGridTable = () => {

  const contacts = useSelector(selectContacts);
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "600px" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  const [rowData, setRowData] = useState();
  const user = JSON.parse(localStorage.getItem("user"));

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "_id",
      headerName: "#",
      minWidth: 170,
      editable: false,
      checkboxSelection: checkboxSelection,
      headerCheckboxSelection: headerCheckboxSelection,
    },
    {
      field: "title",
      headerName: "title",
      minWidth: 170,
      editable: true,
    },
    {
      field: "firstName",
      headerName: "first Name",
      minWidth: 170,
      editable: true,
    },
    {
      field: "lastName",
      headerName: "last Name",
      minWidth: 170,
      editable: true,
    },
    {
      field: "phoneNumber",
      headerName: "phone Number",
      minWidth: 170,
      editable: true,
    },
    {
      field: "email",
      headerName: "Email Address",
      minWidth: 170,
      editable: true,
    },
    {
      field: "physicalAddress",
      headerName: "physical Address",
      minWidth: 170,
      editable: true,
    },
    {
      field: "mailingAddress",
      headerName: "mailing Address",
      minWidth: 170,
      editable: true,
    },
    {
      field: "preferredContactMethod",
      headerName: "Contact Method",
      minWidth: 170,
      editable: true,
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
      filter: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const onGridReady = useCallback(async (params) => {
    console.log("Grid is Ready",contacts);
  }, []);

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
          rowData={contacts}
          columnDefs={columnDefs}
          // autoGroupColumnDef={autoGroupColumnDef}
          defaultColDef={defaultColDef}
          suppressRowClickSelection={true}
          groupSelectsChildren={true}
          rowSelection={"multiple"}
          editType={"fullRow"}
          rowGroupPanelShow={"always"}
          pivotPanelShow={"always"}
          pagination={true}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default ContactsGridTable;
