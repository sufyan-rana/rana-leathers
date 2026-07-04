// lib/db-utils.ts
import { sql } from './db';

// USER FUNCTIONS
export async function getUserById(userId: string) {
  const result = await sql`
    SELECT id, name, email, created_at FROM users WHERE id = ${userId}
  `;
  return result[0];
}

export async function getUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result[0];
}

// CART FUNCTIONS
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

export async function addToCart(userId: string, productId: number, quantity: number, size?: string, color?: string) {
  await sql`
    INSERT INTO cart_items (user_id, product_id, quantity, size, color)
    VALUES (${userId}, ${productId}, ${quantity}, ${size || null}, ${color || null})
    ON CONFLICT (user_id, product_id) 
    DO UPDATE SET 
      quantity = cart_items.quantity + ${quantity},
      size = ${size || null},
      color = ${color || null}
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

// WISHLIST FUNCTIONS
export async function getWishlistItems(userId: string) {
  const result = await sql`
    SELECT 
      p.id, p.name, p.price, p.original_price as "originalPrice",
      p.image_url as image, p.rating, p.slug
    FROM wishlist w
    JOIN products p ON w.product_id = p.id
    WHERE w.user_id = ${userId}
  `;
  return result;
}

export async function addToWishlist(userId: string, productId: number) {
  await sql`
    INSERT INTO wishlist (user_id, product_id)
    VALUES (${userId}, ${productId})
    ON CONFLICT (user_id, product_id) DO NOTHING
  `;
}

export async function removeFromWishlist(userId: string, productId: number) {
  await sql`
    DELETE FROM wishlist 
    WHERE user_id = ${userId} AND product_id = ${productId}
  `;
}

// ORDER FUNCTIONS
export async function createOrder(userId: string, cartItems: any[], shippingAddress: string, paymentMethod: string) {
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const orderResult = await sql`
    INSERT INTO orders (user_id, order_number, total_amount, shipping_address, payment_method)
    VALUES (${userId}, ${orderNumber}, ${totalAmount}, ${shippingAddress}, ${paymentMethod})
    RETURNING id, order_number
  `;
  
  const orderId = orderResult[0].id;
  
  for (const item of cartItems) {
    await sql`
      INSERT INTO order_items (order_id, product_id, quantity, price, size, color)
      VALUES (${orderId}, ${item.product_id}, ${item.quantity}, ${item.price}, ${item.size || null}, ${item.color || null})
    `;
  }
  
  await clearCart(userId);
  
  return orderResult[0];
}

export async function getOrderHistory(userId: string) {
  const result = await sql`
    SELECT 
      o.id, o.order_number, o.total_amount, o.status, o.created_at,
      json_agg(
        json_build_object(
          'name', p.name,
          'quantity', oi.quantity,
          'price', oi.price,
          'image', p.image_url
        )
      ) as items
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ${userId}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  return result;
}