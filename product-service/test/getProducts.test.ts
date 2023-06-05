import { handler } from "../handlers/getProducts";
import { products } from "../mockData/products";

describe("Test for lambda function for get all products", () => {
  it("Get all products", async () => {
    const result = await handler();
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(products);
  });
});
