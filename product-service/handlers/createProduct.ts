import { createPost, tableList } from "../ddb/dbFunctions";
import { response } from "../utils";

export const handler = async (event: any) => {
  try {
    const body = JSON.parse(event.body)
    const result = await createPost(body, tableList[0], tableList[1]);
    return response(201, result);
  } catch (err: any) {
    return response(500, { message: err });
  }
};
