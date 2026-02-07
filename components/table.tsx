import { type GetRowIdParams, type GridReadyEvent } from "ag-grid-community";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import { useCallback, useRef, useState } from "react";
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface TableProps extends AgGridReactProps {
  paginated?: boolean;
  pageSize?: number;
}

const Table = <T,>({ pageSize = 10, ...props }: TableProps) => {
  const gridRef = useRef<AgGridReact>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // todo: might need to uncomment when using forwardRef, also explain why need to use this
  // useImperativeHandle(ref, () => ({
  //   api: gridRef.current?.api ?? null,
  // }));

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const api = params.api;

    const pages = api.paginationGetTotalPages();
    setTotalPages(pages);
    setCurrentPage(api.paginationGetCurrentPage() + 1);
  }, []);

  const getRowId = useCallback(
    (params: GetRowIdParams) => String(params.data.id),
    [],
  );

  const onPaginationChanged = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api) return;

    setCurrentPage(api.paginationGetCurrentPage() + 1);
    setTotalPages(api.paginationGetTotalPages());
  }, []);

  const goToPrevPage = () => {
    gridRef.current?.api.paginationGoToPreviousPage();
  };

  const goToNextPage = () => {
    gridRef.current?.api.paginationGoToNextPage();
  };

  const goToPageNum = (page: number) => {
    gridRef.current?.api.paginationGoToPage(page);
  };

  console.log("table");

  return (
    <div className="h-full w-full flex flex-col gap-2">
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
          onNext={goToNextPage}
          onPageNum={goToPageNum}
        />
      </div>
    </div>
  );
};

export default Table;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageNum: (page: number) => void;
};

// TODO: Fix pagination behaviour
function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onPageNum,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <ShadcnPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={onPrev} />
        </PaginationItem>

        {pages.map((page) => {
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageNum(page - 1)}
                isActive={page === currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        {/* <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem> */}

        <PaginationItem>
          <PaginationNext onClick={onNext} />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
