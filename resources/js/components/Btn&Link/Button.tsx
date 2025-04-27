interface ButtonProps {
    children: React.ReactNode;
    processing?: boolean;
    addHref?: string;
    onClick?: () => void;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, processing, addHref, onClick, className = "" }) => {
    const baseClass = "rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50";

    if (addHref) {
        // Render as a link if href is provided
        return (
            <a
                href={addHref}
                className={`${baseClass} ${className}`}
                onClick={onClick}
            >
                {children}
            </a>
        );
    }

    // Render as a button by default
    return (
        <button
            type="submit"
            disabled={processing}
            className={`${baseClass} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;