class ApiResponse<T = any> {
  public readonly data: T;
  public readonly message: string;
  public readonly success: boolean = true;

  constructor(data: T, message: string = "Success") {
    this.data = data;
    this.message = message;
  }
}

export default ApiResponse;
