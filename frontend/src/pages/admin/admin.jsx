import AdminHeader from "../../components/adminHeader/adminHeader";
import "./admin.css";

function adminPage() {
  let isAuth = true;
  return (
    <>
      {isAuth || (
        <form action="">
          <h1>Enter admin username:</h1>
          <input type="text" name="adminUsername" />
          <h1>Enter admin password:</h1>
          <input type="text" name="adminPassword" />
        </form>
      )}
      <AdminHeader />
    </>
  );
}

export default adminPage;
