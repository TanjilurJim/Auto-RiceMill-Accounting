import useInterface from "@/hooks/useInterface";


const Button = ({children, processing}: ReturnType<typeof useInterface>) => {
    return (
        <button type="submit" disabled={processing} className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover disabled:opacity-50"
        > {children} </button>
    );
};

export default Button;