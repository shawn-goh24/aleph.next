import { type GetRowIdParams, type GridReadyEvent } from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import { useRef, useState } from "react";
import Pagination from "../pagination";

interface TableProps extends AgGridReactProps {
  paginated?: boolean;
  pageSize?: number;
  name?: string;
}

export const Table = <T,>({ pageSize = 10, name, ...props }: TableProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const onGridReady = (params: GridReadyEvent) => {
    const api = params.api;

    const pages = api.paginationGetTotalPages();
    setTotalPages(pages);
    setCurrentPage(api.paginationGetCurrentPage() + 1);
  };

  const getRowId = (params: GetRowIdParams) => {
    return String(params.data.id);
  };

  const onPaginationChanged = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    setCurrentPage(api.paginationGetCurrentPage() + 1);
    setTotalPages(api.paginationGetTotalPages());
  };

  const goToPrevPage = () => {
    gridRef.current?.api.paginationGoToPreviousPage();
  };

  const goToNextPage = () => {
    gridRef.current?.api.paginationGoToNextPage();
  };

  const goToPageNum = (page: number) => {
    gridRef.current?.api.paginationGoToPage(page);
  };

  const goToFirst = () => {
    gridRef.current?.api.paginationGoToPage(0);
  };

  const goToLast = () => {
    gridRef.current?.api.paginationGoToPage(totalPages);
  };

  return (
    <div className="h-full w-full flex flex-col gap-2">
      <p className="font-bold pb-1">{name}</p>
      <div className="flex-1 min-h-0">
        <div style={{ height: "100%", width: "100%" }}>
          <AgGridReact<T>
            ref={gridRef}
            pagination={true}
            paginationPageSize={pageSize}
            onGridReady={onGridReady}
            onPaginationChanged={onPaginationChanged}
            suppressPaginationPanel={true}
            getRowId={getRowId}
            {...props}
          />
        </div>
      </div>
      <div className="shrink-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={goToPrevPage}
          onFirst={goToFirst}
          onNext={goToNextPage}
          onLast={goToLast}
          onPageNum={goToPageNum}
        />
      </div>
    </div>
  );
};
