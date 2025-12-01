'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TableDisplayProps {
  title: string;
  headers: string[];
  rows: string[][];
}

export function TableDisplay({ title, headers, rows }: TableDisplayProps) {
  return (
    <Card className="w-full my-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-4 py-3 text-left font-semibold bg-muted/50"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b hover:bg-accent/50 transition-colors"
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

