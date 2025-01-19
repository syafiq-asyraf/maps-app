import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5050/api",
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = () => axiosInstance.get<T>(this.endpoint).then((res) => res.data);

  post = (data?: T) => {
    return axiosInstance.post<T>(this.endpoint, data).then((res) => res.data);
  };

  postWithSubEndpoint = (subEndpoint: string, data?: T) => {
    return axiosInstance
      .post<T>(`${this.endpoint}/${subEndpoint}`, data)
      .then((res) => res.data);
  };
}

export default APIClient;
