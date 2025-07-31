  export interface SortInfo {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  }
  
  export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: SortInfo;
    offset: number;
    unpaged: boolean;
    paged: boolean;
  }
  
  export interface PaginatedResponse<T> {
    content: T[];
    pageable: Pageable;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
    sort: SortInfo;
    numberOfElements: number;
    empty: boolean;
  }
  