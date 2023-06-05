import { handler } from "../handlers/getProductsById";

const product = {
  description: `Oversized, calf-length dress in woven fabric with a deep V-neckline and narrow drawstrings under the bust that tie at the sides. Long, voluminous balloon sleeves in a raglan cut with narrow elastication at the cuffs. Unlined.`,
  id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
  price: 29.99,
  title: "Oversized tie-detail dress"
};

describe("Test lambda function by id", () => {
  it("should return product by id", async () => {
    const result = await handler({
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a80aa" }
    });
    expect(result.statusCode).toEqual(200);
    expect(JSON.parse(result.body)).toEqual(product);
  });

  it("should return 404 error when product is empty", async () => {
    const result = await handler({
      pathParameters: { productId: "" }
    });
    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual("Product not found");
  });

  it("should return 404 error when product is not found", async () => {
    const result = await handler({
      pathParameters: { productId: "7567ec4b-b10c-48c5-9345-fc73c48a88bb" }
    });
    expect(result.statusCode).toEqual(404);
    expect(JSON.parse(result.body)).toEqual("Product not found");
  });
});
