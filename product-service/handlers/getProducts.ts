import { products } from "./../mockData/products";
import { response } from "../utils";

export const handler = async (event: any) => {
  try {
    return response(200, { products });
  } catch (err: any) {
    return response(500, { message: err });
  }
};
