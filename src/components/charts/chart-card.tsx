"use client";

import { useRef, useState } from "react";
import { Table2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ChartTableData = {
  /** Column headings. The first column names each row, usually the date. */
  columns: readonly string[];
  /** One row per data point, already formatted for reading. */
  rows: ReadonlyArray<readonly string[]>;
};

type ChartCardProps = {
  title: string;
  description?: string;
  /** The same numbers as the chart, for anyone who'd rather read a table. */
  table: ChartTableData;
  className?: string;
  /** The chart itself. */
  children: React.ReactNode;
};

/** A card that holds a chart, with a button to show the same numbers as a table. */
export function ChartCard({ title, description, table, className, children }: ChartCardProps) {
  const [showTable, setShowTable] = useState(false);
  const [tableHeight, setTableHeight] = useState(220);
  const contentRef = useRef<HTMLDivElement>(null);

  function toggleTable() {
    // Give the table the chart's exact height so the card doesn't jump.
    if (!showTable && contentRef.current) setTableHeight(contentRef.current.offsetHeight);
    setShowTable((current) => !current);
  }

  return (
    <Card className={cn("min-w-0", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription className="text-xs text-subtle-foreground">
            {description}
          </CardDescription>
        )}
        <CardAction>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Table view"
                aria-pressed={showTable}
                onClick={toggleTable}
                className="aria-pressed:bg-accent aria-pressed:text-foreground"
              >
                <Table2 />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Table view</TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>
      <CardContent ref={contentRef} className="min-w-0">
        {showTable ? <ChartTable title={title} table={table} height={tableHeight} /> : children}
      </CardContent>
    </Card>
  );
}

function ChartTable({
  title,
  table,
  height,
}: {
  title: string;
  table: ChartTableData;
  height: number;
}) {
  return (
    <div
      role="region"
      aria-label={`${title}, as a table`}
      tabIndex={0}
      className="overflow-y-auto rounded-md border border-border"
      style={{ height }}
    >
      <table className="w-full text-[13px]">
        <thead className="sticky top-0 bg-card">
          <tr>
            {table.columns.map((column, index) => (
              <th
                key={column}
                scope="col"
                className={cn(
                  "h-9 px-3 text-xs font-medium whitespace-nowrap text-subtle-foreground shadow-[inset_0_-1px_0_var(--border)]",
                  index === 0 ? "text-left" : "text-right",
                )}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            // Rows never reorder, and names like video titles can repeat, so the index is the key.
            <tr key={rowIndex} className="border-b border-border last:border-0">
              {row.map((cell, index) =>
                index === 0 ? (
                  // The first column can wrap (long names, like video titles); numbers never do.
                  <th
                    key={index}
                    scope="row"
                    className="h-9 px-3 py-2 text-left font-normal text-muted-foreground"
                  >
                    {cell}
                  </th>
                ) : (
                  <td key={index} className="px-3 text-right whitespace-nowrap tabular-nums">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
