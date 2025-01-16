interface TooltipProps {
    text: string;
    children: React.ReactNode;
}

export const Tooltip = ({ text, children }: TooltipProps) => {
    return (
        <div className="relative group inline-block">
            {children}
            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max px-3 py-1 bg-gray-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {text}
            </span>
        </div>
    );
};
