import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import dayjs from "dayjs";

interface InputCalendarProps {
  value: string;                  // accepts "YYYY-MM-DD" or ISO
  onChange: (val: string) => void; // always emits "YYYY-MM-DD"
  label?: string;
  required?: boolean;
}

const DISPLAY_FMT = "DD-MM-YYYY";
const STORAGE_FMT = "YYYY-MM-DD";

const InputCalendar: React.FC<InputCalendarProps> = ({ value, onChange, label = "Select date", required }) => {
  const [open, setOpen] = React.useState(false);

  // parse any incoming string safely (YYYY-MM-DD or ISO)
  const parsed = value ? dayjs(value) : null;
  const selectedDate = parsed?.isValid() ? parsed.toDate() : undefined;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-foreground mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between font-normal">
            {parsed?.isValid() ? parsed.format(DISPLAY_FMT) : DISPLAY_FMT.toLowerCase()}
            <ChevronDownIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onChange(date ? dayjs(date).format(STORAGE_FMT) : "");
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
