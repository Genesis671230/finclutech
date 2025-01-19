import InvoicesAdd from "components/ui/InvoicesComponents/InvoicesAdd";
// import GridExample from "components/ui/InvoicesComponents/AGGridTable";
// import { InvoicesTable } from "components/ui/InvoicesComponents/InvoicesTable";
import { useDispatch, useSelector } from "react-redux";
import { modalOpened } from "../../redux/slices/editModalSlice/editModalSlice";
import { selectInvoices } from "./invoiceSlice";
import InvoiceGridTable  from "../../components/ui/InvoicesComponents/InvoiceGridTable"
const Invoices = () => {
  const dispatch = useDispatch();
  const invoicesList = useSelector(selectInvoices);

  const handleOpen = () => {
    dispatch(modalOpened());
  };

  return (
    <>
      <div> 
        <div className="my-2 w-full overscroll-auto flex justify-end">
        <InvoicesAdd />
        </div>
        <div className="overflow-auto ">
        {/* <GridExample revenueReports={invoicesList}/> */}
        
          {/* <InvoicesTable invoicesList={invoicesList} /> */}
          <InvoiceGridTable invoicesList={invoicesList}  />
        </div>
      </div>
    </>
  );
};

export default Invoices;
