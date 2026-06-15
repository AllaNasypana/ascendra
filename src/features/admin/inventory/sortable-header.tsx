import { FC } from "react";

import { InventorySortColumn, InventorySortDirection } from "./inventory-sorting";
import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";


interface SortableHeaderProps {
    label: string;
    column: InventorySortColumn;
    activeColumn: InventorySortColumn;
    direction: InventorySortDirection;
    onSort: (column: InventorySortColumn) => void;
  }
  
  const getAriaSort = (
    isActive: boolean,
    direction: InventorySortDirection
  ): "ascending" | "descending" | "none" => {
    if (!isActive) return "none";
    return direction === "asc" ? "ascending" : "descending";
  };
  
  export const SortableHeader: FC<SortableHeaderProps> = ({
    label,
    column,
    activeColumn,
    direction,
    onSort,
  }) => {
    const isActive = activeColumn === column;
  
    return (
      <th scope="col" aria-sort={getAriaSort(isActive, direction)}>
        <button
          type="button"
          onClick={() => onSort(column)}
          className="inline-flex -ml-1 items-center gap-1 rounded px-1 transition-colors hover:text-foreground"
        >
          {label}
  
          {isActive ? (
            direction === "asc" ? (
              <FiChevronUp className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <FiChevronDown className="h-3.5 w-3.5" aria-hidden />
            )
          ) : (
            <span className="inline-flex flex-col text-muted-foreground/40" aria-hidden>
              <FiChevronUp className="h-2.5 w-2.5 -mb-1" />
              <FiChevronDown className="h-2.5 w-2.5" />
            </span>
          )}
        </button>
      </th>
    );
  };