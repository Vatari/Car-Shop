import { setObjectData } from "../util.js";
import * as api from "./requester.js";

const endpoints = {
  recent: `/data/`,
  listings: "/data/cars?sortBy=created%20desc",
  create: "/data/cars",
  byId: "/data/cars/",
  deleteById: "/data/cars/",
  edit: "/data/cars/",
  search: "/data/cars",
};

export async function getRecent(ctx) {
  const url = `cars?where=ownerId%3D'${ctx.user.objectId}'&sortBy=created%20desc`;
  return api.get(endpoints.recent + url);
}

export async function getAll() {
  const data = await api.get(endpoints.listings);
  setObjectData(data);
  return api.get(endpoints.listings);
}

export async function create(data) {
  return api.post(endpoints.create, data);
}
export async function getById(id) {
  return api.get(endpoints.byId + id);
}

export async function edit(id, data) {
  return api.put(endpoints.edit + id, data);
}

export async function deleteById(id) {
  return api.del(endpoints.deleteById + id);
}
export async function search(query) {
  const url = `?where=year%3D${query}`;
  return await api.get(endpoints.search + url);
}
