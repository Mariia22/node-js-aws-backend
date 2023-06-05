import { products } from "./../mockData/products";
import { response } from "../utils";

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters.productId;
    if (!id) {
      return response(404, "Product not found");
    }
    const product = products.find((item) => item.id === id);

    if (!product) {
      return response(404, "Product not found");
    }
    return response(200, product);
  } catch (err: any) {
    return response(500, { message: err });
  }
};
