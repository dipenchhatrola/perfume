import axios from "axios";

const API = "http://localhost:5000/api/orders";

export const getOrders = () => axios.get(API);
export const acceptOrder = (id: string) =>
  axios.put(`${API}/${id}/accept`);
export const rejectOrder = (id: string) =>
  axios.put(`${API}/${id}/reject`);