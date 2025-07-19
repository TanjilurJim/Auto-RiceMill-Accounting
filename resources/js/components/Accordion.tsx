import React from 'react';

export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="divide-y">{children}</div>;
}

export function AccordionItem({
  header,
  children,
}: {
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        className="w-full text-left py-2 font-medium flex justify-between items-center"
        onClick={() => setOpen(!open)}
      >
        {header}
        <span className="text-sm">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="py-2">{children}</div>}
    </div>
  );
}
