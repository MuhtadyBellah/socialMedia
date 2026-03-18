export interface Default {}

export interface DefaultResponse {
  success: true;
  message: string;
  data: any;
}

export interface Paged<T> extends DefaultResponse {
  meta: {
    feedMode: string;
    pagination: Pagination;
  };
}

interface Pagination {
  currentPage: number;
  limit: number;
  total: number;
  numberOfPages: number;
  nextPage: number | null;
  prevPage: number | null;
}
