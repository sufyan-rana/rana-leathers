// lib/db-utils.ts
import { query } from './db';

// ============================================
// CART FUNCTIONS
// ============================================

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

export async function addToCart(userId: string, productId: number, quantity: number, size?: string, color?: string) {
  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity, size, color)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id, product_id) 
     DO UPDATE SET 
       quantity = cart_items.quantity + $3,
       size = $4,
       color = $5`,
    [userId, productId, quantity, size || null, color || null]
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

// ============================================
// USER FUNCTIONS
// ============================================

export async function getUserById(userId: string) {
  const result = await query(
    'SELECT id, name, email, created_at FROM users WHERE id = $1',
    [userId]
  );
  return result.rows[0];
}

// ============================================
// WISHLIST FUNCTIONS
// ============================================

export async function getWishlistItems(userId: string) {
  const result = await query(
    `SELECT 
      p.id, p.name, p.price, p.original_price as "originalPrice",
      p.image_url as image, p.rating, p.slug
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = $1`,
    [userId]
  );
  return result.rows;
}

export async function addToWishlist(userId: string, productId: number) {
  await query(
    'INSERT INTO wishlist (user_id, product_id) VALUES ($1, $2) ON CONFLICT (user_id, product_id) DO NOTHING',
    [userId, productId]
  );
}

export async function removeFromWishlist(userId: string, productId: number) {
  await query(
    'DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );
}