import { scan, tableList } from "../ddb/dbFunctions";
import { joinArrays, response } from "../utils";

export const handler = async () => {
  try {
    const products = await scan(tableList[0]);
    const stocks = await scan(tableList[1]);
    if (products && products.length > 0 && stocks && stocks.length > 0) {
      const body = await joinArrays(products, stocks);
      return response(200, body);
    } else {
      return response(500, {
        message: "Products not derived from the database"
      });
    }
  } catch (err: any) {
    return response(500, { message: err });
  }
};
