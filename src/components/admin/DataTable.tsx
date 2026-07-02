import { ReactNode } from "react";

interface DataTableProps {
  headers: string[];
  children: ReactNode;
}

export default function DataTable({ headers, children }: DataTableProps) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-4 sm:px-6 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
