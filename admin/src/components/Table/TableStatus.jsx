import React, { useContext } from "react";
import { TableContext } from "../../Context/TableContext";
import "./TablesStatus.css";

const TablesStatus = () => {
  const { tables, setTables } = useContext(TableContext);

  if (!tables || !Array.isArray(tables)) {
    return <div className="p-4 text-gray-600">Loading tables...</div>;
  }

  const availableTablesCount = tables.filter(
    (t) => t.status === "available"
  ).length;
  const reservedTablesCount = tables.filter(
    (t) => t.status === "reserved"
  ).length;

  return (
    <div className="tables-status-card">
      <div className="card-header">
        <h3>Tables</h3>
        <div className="counts">
          <span className="color">
            <p className="availableColor"></p> Available: {availableTablesCount}{" "}
          </span>
          <span className="color">
            <p className="reservedColor"></p> Reserved: {reservedTablesCount}{" "}
          </span>
        </div>
      </div>
      <div className="tables-grid">
        {tables.map((table) => (
          <div
            key={table.id}
            className={`table ${table.status === "available" ? "available-bg" : "reserved-bg"}`}
          >
            Table
            <br />
            {String(table.name).replace("Table ", "").padStart(2, "0")}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesStatus;
