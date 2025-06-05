import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const TableContext = createContext(null);

// Create a provider component
export const TableProvider = ({ children }) => {
     const defaultTables = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Table ${String(i + 1).padStart(2, "0")}`,
    chairs: "03",
    status: Math.random() > 0.5 ? "available" : "reserved",
  }));

  const [tables, setTables] = useState(defaultTables);

  const contextValue = {
    tables,
    setTables,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
};