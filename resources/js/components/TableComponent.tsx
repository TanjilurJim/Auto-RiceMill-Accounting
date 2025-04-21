import React from 'react';

interface TableColumn<T> {
    header: string;
    accessor: string | ((row: T, index?: number) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    actions?: (row: T) => React.ReactNode;
    noDataMessage?: string;
}

const TableComponent = <T,>({ columns, data, actions, noDataMessage = 'No data found.' }: TableProps<T>) => {
    return (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300 shadow-md">
                <thead className="bg-gray-200">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className={`border border-gray-300 p-2 text-left text-sm font-medium text-gray-700 ${column.className || ''}`}
                            >
                                {column.header}
                            </th>
                        ))}
                        {actions && (
                            <th className="border border-gray-300 p-2 text-left text-sm font-medium text-gray-700">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.length ? (
                        data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-200">
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        className={`border border-gray-300 p-2 text-sm text-gray-700 ${column.className || ''}`}
                                    >
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(row, rowIndex)
                                            : String(row[column.accessor as keyof T] ?? '')}
                                    </td>
                                ))}
                                {actions && (
                                    <td className="border border-gray-300 p-2 text-sm text-gray-700">
                                        {actions(row)}
                                    </td>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length + (actions ? 1 : 0)}
                                className="border border-gray-300 px-4 py-2 text-center text-sm text-gray-500"
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