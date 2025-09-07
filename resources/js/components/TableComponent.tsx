import React from "react";

interface TableColumn<T> {
  header: string;
  accessor: string | ((row: T, index?: number) => React.ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  actions?: (row: T, index?: number) => React.ReactNode;
  noDataMessage?: string;
}

const TableComponent = <T,>({
  columns,
  data,
  actions,
  noDataMessage = "No data found.",
}: TableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card text-card-foreground shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted/70 text-foreground">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`border-b border-border px-3 py-2 text-left text-sm font-medium ${column.className || ""}`}
              >
                {column.header}
              </th>
            ))}
            {actions && (
              <th className="border-b border-border px-3 py-2 text-left text-sm font-medium">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="odd:bg-card even:bg-muted/30 hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border-t border-border px-3 py-2 text-sm ${column.className || ""}`}
                  >
                    {typeof column.accessor === "function"
                      ? column.accessor(row, rowIndex)
                      : String((row as any)[column.accessor] ?? "")}
                  </td>
                ))}
                {actions && (
                  <td className="border-t border-border px-3 py-2 text-sm">
                    {actions(row, rowIndex)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="border-t border-border px-4 py-6 text-center text-sm text-muted-foreground"
              >
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
