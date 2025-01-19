import LeadAdd from "components/ui/LeadsComponents/LeadAdd";
// import GridExample from "components/ui/InvoicesComponents/AGGridTable";
// import { InvoicesTable } from "components/ui/InvoicesComponents/InvoicesTable";
import { useDispatch } from "react-redux";
import { modalOpened } from "../../redux/slices/editModalSlice/editModalSlice";
import ContactsGridTable from "components/ui/ContactComponents/ContactsGridTable";
import ContactAdd from "components/ui/ContactComponents/ContactAdd";
const Contacts = () => {
  const dispatch = useDispatch();

  const handleOpen = () => {
    dispatch(modalOpened());
  };

  return (
    <>
      <div>
        <div className="my-2 w-full overscroll-auto flex justify-end">
          <ContactAdd />
        </div>
        <div className="overflow-auto ">
          {/* <GridExample revenueReports={invoicesList}/> */}

          {/* <InvoicesTable invoicesList={invoicesList} /> */}
          <ContactsGridTable />
        </div>
      </div>
    </>
  );
};

export default Contacts;
