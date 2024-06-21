
export interface RestResult {
  status: 200 | 201 | 400 | 500;
  message?: string;
  data?: any;
}
