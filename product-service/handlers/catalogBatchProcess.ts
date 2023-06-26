import { response } from "../utils";
import { createProduct, tableList } from "../ddb/dbFunctions";

export const handler = async (event: any) => {
  try {
    const records = event.Records;
    for (const record of records) {
      await createProduct(record.body, tableList[0], tableList[1]);
    }
    return response(200, records);
  } catch (error) {
    return response(500, { message: error });
  }
};
