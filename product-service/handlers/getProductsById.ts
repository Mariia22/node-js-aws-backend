import { getItemById } from "../ddb/dbFunctions";
import { response } from "../utils";

export const handler = async (event: any) => {
  try {
    const id = event.pathParameters.productId;
    if (!id) {
      return response(404, "Product not found");
    }
    const product = await getItemById(process.env.TABLE_NAME_BASE, id);

    if (!product) {
      return response(404, "Product not found");
    }
    return response(200, product);
  } catch (err: any) {
    return response(500, { message: err });
  }
};
