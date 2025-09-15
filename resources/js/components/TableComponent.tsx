import React from 'react';

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

const TableComponent = <T,>({ columns, data, actions, noDataMessage = 'No data found.' }: TableProps<T>) => {
    return (
        <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
            <div className="w-full overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead>
                        <tr className="bg-muted/70 text-foreground">
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className={`border-border border-b px-3 py-2 text-left text-sm font-medium ${column.className || ''}`}
                                >
                                    {column.header}
                                </th>
                            ))}
                            {actions && <th className="border-border border-b px-3 py-2 text-left text-sm font-medium">Actions</th>}
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
                                        <td key={colIndex} className={`border-border border-t px-3 py-2 text-sm ${column.className || ''}`}>
                                            {typeof column.accessor === 'function'
                                                ? column.accessor(row, rowIndex)
                                                : String((row as any)[column.accessor] ?? '')}
                                        </td>
                                    ))}
                                    {actions && <td className="border-border border-t px-3 py-2 text-sm">{actions(row, rowIndex)}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="border-border text-muted-foreground border-t px-4 py-6 text-center text-sm"
                                >
                                    {noDataMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableComponent;
