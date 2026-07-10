import { database } from "../../utils/database";
import type { CreateProductDto, UpdateProductDto } from "./product.types";

export const createProduct = async (productData: CreateProductDto) => {
  const productId =  productData.product_id;
  const productName = productData.product_name;
  const { description } = productData;

  if (!productId) {
    throw new Error("Product ID is required");
  }
  if (!productName) {
    throw new Error("Product Name is required");
  }

  const existingProduct = await database.query(
    "SELECT * FROM products WHERE product_id = $1",
    [productId],
  );

  if (existingProduct.rows.length > 0) {
    throw new Error("Product code is already exist");
  }

  const result = await database.query(
    `
    INSERT INTO products
    (product_id, product_name, description)
    VALUES($1,$2,$3)
    RETURNING *
    `,
    [productId, productName, description],
  );
  return result.rows[0];
};

export const getProducts = async () => {
  const result = await database.query(
    "SELECT * FROM products ORDER BY id DESC",
  );

  return result.rows;
};

export const getProductById = async (id: number) => {
  const result = await database.query("SELECT * FROM products WHERE id = $1", [
    id,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Product not found");
  }

  return result.rows[0];
};

export const updateProduct = async (
  id: number,
  productData: UpdateProductDto,
) => {
  const productId = productData.product_id;
  const productName = productData.product_name;
  const { description } = productData;

  const result = await database.query(
    `
    UPDATE products
    SET 
      product_id = $1,
      product_name = $2,
      description = $3 
      WHERE id = $4
      RETURNING *
    `,
    [productId, productName, description, id],
  );

  if (result.rows.length === 0) {
    throw new Error("Product not found");
  }

  return result.rows[0];
};

export const deleteProduct = async (id: number) => {
  const result = await database.query(
    "DELETE FROM products WHERE id = $1 RETURNING *",
    [id],
  );

  if (result.rows.length === 0) {
    throw new Error("Product not found");
  }

  return {
    message: "Product deleted successfully",
  };
};
