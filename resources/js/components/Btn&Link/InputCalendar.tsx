import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import dayjs from "dayjs";

interface InputCalendarProps {
    value: string;
    onChange: (val: string) => void;
    label?: string;
    required?: boolean;
}

const InputCalendar: React.FC<InputCalendarProps> = ({ value, onChange, label = "Select date", required }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full justify-between font-normal"
                    >
                        {value
                            ? dayjs(value).format("DD/MM/YYYY")
                            : "DD/MM/YYYY"}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={date => {
                            onChange(date ? dayjs(date).format("YYYY-MM-DD") : "");
                            setOpen(false);
                        }}
                        captionLayout="dropdown"
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default InputCalendar;