function UnauthorizedPage() {
  const divStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    width: "fit-content",
    marginTop: "2rem",
    marginInline: "auto",
  };

  const h1Style = {
    color: "var(--red)",
    fontSize: "clamp(var(--fs-h4), 3vw, var(--fs-h2)",
    textAlign: "center",
  };

  const pStyle = {
    color: "var(--text-color)",
    fontSize: "clamp(var(--fs-small), 3vw, var(--fs-p)",
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
