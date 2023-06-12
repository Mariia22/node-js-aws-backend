import { scan } from "../ddb/dbFunctions";
import { response } from "../utils";

export const handler = async () => {
  try {
    let body = await scan(process.env.TABLE_NAME_BASE);
    return response(200, body);
  } catch (err: any) {
    return response(500, { message: err });
  }
};
