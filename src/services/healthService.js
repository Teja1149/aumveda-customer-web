import { api } from "./api";


export async function getBackendHealth() {
  return api.get("/health");
}