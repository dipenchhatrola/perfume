import axios from "axios";

const API = "http://localhost:5000/api/products";

export const addProduct = (data: FormData) =>
  axios.post(API, data);
export const getProducts = () => axios.get(API);
export const deleteProduct = (id: string) =>
  axios.delete(`${API}/${id}`);