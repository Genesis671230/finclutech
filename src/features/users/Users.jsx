import UsersAdd from "components/ui/UsersComponents/UsersAdd";
import UsersGridTable from "components/ui/UsersComponents/UsersGridTable";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {  getSelectedUsersId, selectUsers } from "./userSlice";
const Users = () => {
  const dispatch = useDispatch();
  const usersList = useSelector(selectUsers);
  const selectedUsersId = useSelector(getSelectedUsersId);

  const handleDelete = () => {
    if (selectedUsersId.length > 0) {
      dispatch(deleteDealAsync());
    } else {
      console.log("No Users selected for deletion");
    }
  };

  return (
    <>
      <div>
        <div className="my-2 w-full overscroll-auto flex justify-end">
          <div className="flex mr-2 w-9 h-10 justify-center items-end">
            {selectedUsersId?.length > 0 && (
              <AiOutlineDelete
                onClick={handleDelete}
                className="text-red-700 w-9 shadow-md hover:scale-110 cursor-pointer h-9 text-center"
              />
            )}
          </div>
          <UsersAdd />
        </div>
        <div className="overflow-auto ">
          <UsersGridTable userlist={usersList} />
          {/* <GridExample revenueReports={invoicesList}/> */}
          {/* <UsersTable UsersList={UsersList} /> */}
        </div>
      </div>
    </>
  );
};

export default Users;
