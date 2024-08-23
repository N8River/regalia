import "./adminHeader.css";

function AdminHeader() {
  return (
    <header className="adminHeader">
      <a href="/admin/add-product">Add a product</a>
      <a href="/admin/edit-product">Edit a product</a>

      <button className="adminSignOut">Sign Out</button>
    </header>
  );
}

export default AdminHeader;
