function getRange(start: number, end: number) {
  return [...Array(end - start).keys()].map((element) => element + start);
}

export function getPages(
  totalPages: number,
  pagesCutCount: number,
  currentPage: number,
) {
  const ceiling = Math.ceil(pagesCutCount / 2);
  const floor = Math.floor(pagesCutCount / 2);
  let cutPages = null;

  if (totalPages < pagesCutCount) {
    // if total page less than amount to cut
    cutPages = { start: 1, end: totalPages + 1 };
  } else if (currentPage >= 1 && currentPage <= ceiling) {
    // range when current page count is less than equals to cut count
    cutPages = { start: 1, end: pagesCutCount + 1 };
  } else if (currentPage + floor >= totalPages) {
    // when current page is 2 away from last page
    cutPages = { start: totalPages - pagesCutCount + 1, end: totalPages + 1 };
  } else {
    // when current page is around the center away from the first or last page
    cutPages = {
      start: currentPage - ceiling + 1,
      end: currentPage + floor + 1,
    };
  }

  const pages = getRange(cutPages.start, cutPages.end).map((page, index) => {
    if (
      (page !== 1 && index === 0) ||
      (page !== totalPages && index === pagesCutCount - 1)
    ) {
      return "ellipsis";
    } else {
      return page;
    }
  });

  return pages;
}
