import { createProduct, tableList } from "../ddb/dbFunctions";
import { response, validateProductBody } from "../utils";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body);
    if (validateProductBody(body)) {
      const result = await createProduct(body, tableList[0], tableList[1]);
      return response(201, result);
    }
    return response(400, { message: "Product data is invalid" });
  } catch (err: any) {
    return response(500, { message: err });
  }
};
