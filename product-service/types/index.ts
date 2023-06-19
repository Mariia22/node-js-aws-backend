export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
};

export type Stock = {
  id: string;
  count: number;
};

export type RequestBody = {
  title: string;
  description: string;
  price: number;
  count: number;
}
