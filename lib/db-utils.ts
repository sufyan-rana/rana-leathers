// lib/db-utils.ts
import { query } from './db';

export async function getCartItems(userId: string) {
  const result = await query(
    `SELECT 
      c.id, c.quantity, c.size, c.color,
      p.id as product_id, p.name, p.price, p.image_url as image, p.slug
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function addToCart(userId: string, productId: number, quantity: number) {
  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET quantity = cart_items.quantity + $3`,
    [userId, productId, quantity]
  );
}

export async function removeFromCart(userId: string, productId: number) {
  await query(
    'DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
}

export async function updateCartQuantity(userId: string, productId: number, quantity: number) {
  if (quantity <= 0) {
    await removeFromCart(userId, productId);
    return;
  }
  await query(
    'UPDATE cart_items SET quantity = $1 WHERE user_id = $2 AND product_id = $3',
    [quantity, userId, productId]
  );
}