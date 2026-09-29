import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  imageUrl: text("image_url").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updateAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  comment: text("comment").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, {
      onDelete: "cascade",
    }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

// relation define how tables connect to each other. this enables drizzle's query APU
// to automatically join related data when using `with: { relationName: true }`

// Users Relations: A user can have many products and many comments
// `one()` means a single threaded record, `many()` means multiple related records

export const userRelations = relations(users, ({ many }) => ({
  products: many(products),
  comments: many(comments),
}));

// Products Relations: a product belongs to one user and can have many comments
// `one()` means single threaded record, `many()` means multiple related records

export const productRelations = relations(products, ({ one, many }) => ({
  comments: many(comments),
  // `fields` = the foreign key column in this table (products.userId)
  // `references` = the primary key column in the related table (users.id)
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }), // one product -> one user
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  product: one(products, {
    fields: [comments.productId],
    references: [products.id],
  }),
  // `fields` = the foreign key column in this table (comments.userId)
  // `references` = the primary key column in the related table (users.id)
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }), // one product -> one user
}));

// type inference
export type User = typeof users.$inferSelect;
export type newUser = typeof users.$inferInsert;

export type Product = typeof products.$inferSelect;
export type newProduct = typeof products.$inferInsert;

export type Comment = typeof comments.$inferSelect;
export type newComment = typeof comments.$inferInsert;
