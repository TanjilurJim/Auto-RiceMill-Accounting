interface CustomTableProps {
    headers: React.ReactNode; // Table headers
    children: React.ReactNode; // Table body content
    className?: string; // Optional additional classes for styling
}

const CustomTable: React.FC<CustomTableProps> = ({ headers, children, className }) => {
    return (
        <div className={`overflow-x-auto rounded-lg bg-background shadow ${className}`}>
            <table className="min-w-full border-collapse border border-gray-200 text-left">
                <thead className="bg-gray-100">
                    <tr>{headers}</tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
};

export default CustomTable;