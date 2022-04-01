export interface IAPIResponse {
  status_code: number;
  success: boolean;
  errors?: any;
  data?: any;
}
