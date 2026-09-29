import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  users,
  comments,
  products,
  type newUser,
  type newComment,
  type newProduct,
} from "./schema";

// USER QUERIES
export const createUser = async (data: newUser) => {
  const [user] = await db.insert(users).values(data).returning();
  return user;
};

export const getUserById = async (id: string) => {
  return db.query.users.findFirst({ where: eq(users.id, id) });
};

export const updateUser = async (id: string, data: Partial<newUser>) => {
  // Partial bisa tidak semua diupdate
  const [user] = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  return user;
};

// upsert = create or update
export const upsertUser = async (data: newUser) => {
  const existingUser = await getUserById(data.id);
  if (existingUser) return updateUser(data.id, data);
  return createUser(data);
};

// PRODUCT QUERIES
export const createProduct = async (data: newProduct) => {
  const [product] = await db.insert(products).values(data).returning();
  return product;
};

export const getAllProduct = async () => {
  return db.query.products.findMany({
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const getProductById = async (id: string) => {
  return db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      user: true,
      comments: {
        with: { user: true },
        orderBy: (comments, { desc }) => [desc(comments.createdAt)],
      },
    },
  });
};

export const getProductByUserId = async (userId: string) => {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    with: { user: true },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });
};

export const updateProduct = async (id: string, data: Partial<newProduct>) => {
  const [product] = await db
    .update(products)
    .set(data)
    .where(eq(products.id, id))
    .returning();
  return product;
};

export const deleteProduct = async (id: string) => {
  const [product] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();
  return product;
};

// COMMENT QUERIES
export const createComment = async (data: newComment) => {
  const [comment] = await db.insert(comments).values(data).returning();
  return comment;
};

export const deleteComment = async (id: string) => {
  const [comment] = await db
    .delete(comments)
    .where(eq(comments.id, id))
    .returning();
  return comment;
};

export const getCommentById = async (id: string) => {
  return db.query.comments.findFirst({
    where: eq(comments.id, id),
    with: { user: true },
  });
};
