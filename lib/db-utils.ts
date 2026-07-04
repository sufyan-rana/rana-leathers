// lib/db-utils.ts
import { sql } from './db';

export async function getCartItems(userId: string) {
  const result = await sql`
    SELECT 
      c.id, c.quantity, c.size, c.color,
      p.id as product_id, p.name, p.price, p.image_url as image, p.slug
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ${userId}
  `;
  return result;
}

export async function addToCart(userId: string, productId: number, quantity: number) {
  await sql`
    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES (${userId}, ${productId}, ${quantity})
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET quantity = cart_items.quantity + ${quantity}
  `;
}

export async function removeFromCart(userId: string, productId: number) {
  await sql`
    DELETE FROM cart_items 
    WHERE user_id = ${userId} AND product_id = ${productId}
  `;
}

export async function updateCartQuantity(userId: string, productId: number, quantity: number) {
  if (quantity <= 0) {
    await removeFromCart(userId, productId);
    return;
  }
  await sql`
    UPDATE cart_items 
    SET quantity = ${quantity}
    WHERE user_id = ${userId} AND product_id = ${productId}
  `;
}

export async function clearCart(userId: string) {
  await sql`
    DELETE FROM cart_items WHERE user_id = ${userId}
  `;
}