import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { getPages } from "./utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onFirst: () => void;
  onNext: () => void;
  onLast: () => void;
  onPageNum: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onFirst,
  onNext,
  onLast,
  onPageNum,
}: PaginationProps) {
  const pages = getPages(totalPages, 5, currentPage);
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <ShadcnPagination>
      <PaginationContent>
        <ButtonGroup>
          <Button variant={"outline"} onClick={onFirst} disabled={isFirstPage}>
            First
          </Button>
          <Button variant={"outline"} onClick={onPrev} disabled={isFirstPage}>
            Prev
          </Button>
        </ButtonGroup>

        {pages.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <PaginationItem key={`${page}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

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

        <ButtonGroup>
          <Button
            variant={"outline"}
            onClick={onNext}
            disabled={totalPages === 0 || isLastPage}
          >
            Next
          </Button>
          <Button
            variant={"outline"}
            onClick={onLast}
            disabled={totalPages === 0 || isLastPage}
          >
            Last
          </Button>
        </ButtonGroup>
      </PaginationContent>
    </ShadcnPagination>
  );
}
