import { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export default function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 sm:px-6 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
