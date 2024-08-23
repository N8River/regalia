function UnauthorizedPage() {
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "100%",
    margin: "2rem",
  };

  const h1Style = {
    color: "var(--red)",
    fontSize: "2rem",
    textAlign: "center",
  };

  const pStyle = {
    color: "var(--text-color)",
    fontSize: "1rem",
    textAlign: "center",
  };

  return (
    <div style={divStyle}>
      <h1 style={h1Style}>ACCESS DENIED</h1>
      <p style={pStyle}>You do not have permission to view this page.</p>
    </div>
  );
}

export default UnauthorizedPage;
