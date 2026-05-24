import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# Your Gemini API Key
GEMINI_API_KEY = "AIzaSyDouub0TQ2X8qQBBaUlmhTtcNk9Rg1zXAs"

print(f"✅ API Key loaded")

app = FastAPI(title="RANA LEATHER'S Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Product data
PRODUCTS = [
    {"id": 1, "name": "Premium Leather Jacket", "category": "Jackets", "price": 29999, "originalPrice": 44999, "material": "Full-grain Buffalo Leather", "description": "Handcrafted from full-grain buffalo leather with YKK zippers and quilted lining. Perfect for winter wear."},
    {"id": 2, "name": "Handcrafted Tote Bag", "category": "Bags", "price": 15999, "material": "Full-grain Cowhide Leather", "description": "Elegant tote bag made from soft full-grain cowhide leather. Spacious with interior zip pocket."},
    {"id": 3, "name": "Classic Leather Belt", "category": "Belts", "price": 3999, "material": "Full-grain Cowhide", "description": "Timeless leather belt with premium brass buckle. Hand-stitched edges for durability."},
    {"id": 4, "name": "Minimalist Wallet", "category": "Wallets", "price": 2499, "material": "Vegetable-tanned Leather", "description": "Slim, RFID-blocking wallet from vegetable-tanned leather. Holds 6-8 cards."},
    {"id": 5, "name": "Leather Chelsea Boots", "category": "Shoes", "price": 18999, "material": "Pull-up Leather", "description": "Classic Chelsea boots with elastic side panels and cushioned insole."},
    {"id": 6, "name": "Leather Backpack", "category": "Bags", "price": 12999, "material": "Full-grain Cowhide", "description": "Versatile backpack with padded laptop compartment. Perfect for work or travel."}
]

COMPANY_INFO = {
    "name": "RANA LEATHER'S",
    "shipping": "Free shipping on orders over Rs. 5,000. Delivery in 2-3 business days.",
    "returns": "30-day return policy on unused products.",
    "contact": "Email: info@ranaleathers.com | Phone: +92 300 1234567"
}

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    session_id: str

chat_history = {}

# Comprehensive product details response
PRODUCT_DETAILS = """🛍️ **Complete Product Catalog - RANA LEATHER'S**

**1. Premium Leather Jacket** 🧥
• Price: Rs. 29,999 (Original: Rs. 44,999 - 33% OFF!)
• Material: Full-grain buffalo leather
• Features: YKK zippers, quilted lining, multiple pockets
• Sizes: S, M, L, XL, XXL
• Colors: Brown, Black
• Care: Wipe clean, condition every 3-4 months
• Perfect for: Winter wear, casual outings, motorcycle riding

**2. Handcrafted Tote Bag** 👜
• Price: Rs. 15,999
• Material: Full-grain cowhide leather
• Features: Interior zip pocket, magnetic snap closure
• Size: One size (fits 15-inch laptop)
• Colors: Brown, Tan, Black
• Perfect for: Daily use, office, shopping

**3. Classic Leather Belt** 👔
• Price: Rs. 3,999
• Material: Full-grain cowhide
• Features: Solid brass buckle, hand-stitched edges
• Sizes: 28, 30, 32, 34, 36, 38, 40, 42
• Colors: Brown, Black
• Perfect for: Formal and casual wear

**4. Minimalist Wallet** 👛
• Price: Rs. 2,499 (Original: Rs. 3,999)
• Material: Vegetable-tanned leather
• Features: RFID-blocking, 6-8 card slots, bill compartment
• Size: Ultra-slim (0.5 inches)
• Colors: Brown, Black, Tan
• Perfect for: Everyday carry, gifts

**5. Leather Chelsea Boots** 👢
• Price: Rs. 18,999 (Original: Rs. 27,999)
• Material: Pull-up leather
• Features: Elastic side panels, cushioned insole, rubber outsole
• Sizes: 39, 40, 41, 42, 43, 44
• Colors: Brown, Black
• Perfect for: Daily wear, office, casual outings

**6. Leather Backpack** 🎒
• Price: Rs. 12,999
• Material: Full-grain cowhide
• Features: Padded laptop sleeve (fits 15-inch), drawstring closure
• Size: One size (18″ x 12″ x 5″)
• Colors: Brown, Black, Tan
• Perfect for: Work, travel, college

**Shipping:** Free on orders over Rs. 5,000 (2-3 days delivery)
**Returns:** 30-day easy returns
**Warranty:** 6-month manufacturing warranty

Which product interests you? I can provide more specific details! ✨"""

LEATHER_KNOWLEDGE = """📚 **Leather Knowledge Guide**

**Leather Types:**
• Full-grain: Highest quality, most durable, develops patina over time
• Top-grain: Second highest, sanded for uniform look
• Genuine leather: Good quality, more affordable
• Vegetable-tanned: Natural, eco-friendly, ages beautifully

**Animal Comparison:**
• Buffalo: Very durable, distinct grain, great for jackets (our jacket uses this!)
• Cowhide: Versatile, softens with use, most common (our bags, belts use this)
• Sheepskin: Soft, lightweight, excellent insulation
• Goatskin: Flexible, water-resistant

**Leather Care:**
• Clean with soft damp cloth - never soak
• Condition every 3-6 months
• Keep away from direct sunlight and heat
• Store in cool, dry place
• Apply waterproof spray for rain protection

Need specific information about any leather topic? Ask me! ✨"""

def get_intelligent_response(message: str) -> str:
    """Get intelligent response for any question"""
    msg = message.lower()
    
    # Product questions
    if "product" in msg or "products" in msg or "catalog" in msg or "what do you sell" in msg:
        return PRODUCT_DETAILS
    
    # Leather knowledge questions
    elif "leather type" in msg or "full grain" in msg or "top grain" in msg or "vegetable tanned" in msg:
        return LEATHER_KNOWLEDGE
    
    # Jacket specific
    elif "jacket" in msg:
        return "🧥 **Premium Leather Jacket** - Rs. 29,999 (was Rs. 44,999)\n\n• Made from full-grain buffalo leather\n• YKK zippers with quilted lining\n• Available in S-XXL in Brown and Black\n• Perfect for winter and casual wear\n• Care: Wipe clean, condition every 3-4 months\n\nWould you like to know about sizing or colors?"
    
    # Bag specific
    elif "bag" in msg or "tote" in msg:
        return "👜 **Handcrafted Tote Bag** - Rs. 15,999\n\n• Full-grain cowhide leather\n• Spacious with interior zip pocket\n• One size fits all\n• Available in Brown, Tan, and Black\n• Perfect for daily use, office, or shopping\n\nWe also have a Leather Backpack for Rs. 12,999 if you need hands-free option!"
    
    # Belt specific
    elif "belt" in msg:
        return "👔 **Classic Leather Belt** - Rs. 3,999\n\n• Full-grain cowhide leather\n• Solid brass buckle\n• Hand-stitched edges for durability\n• Available sizes: 28-42\n• Colors: Brown and Black\n\nGreat for formal and casual wear - an everyday essential!"
    
    # Wallet specific
    elif "wallet" in msg:
        return "👛 **Minimalist Wallet** - Rs. 2,499 (was Rs. 3,999)\n\n• Vegetable-tanned leather\n• RFID-blocking technology\n• Holds 6-8 cards plus cash\n• Ultra-slim design (0.5 inches)\n• Colors: Brown, Black, Tan\n\nPerfect everyday wallet or gift!"
    
    # Boots specific
    elif "boots" in msg or "shoe" in msg:
        return "👢 **Leather Chelsea Boots** - Rs. 18,999 (was Rs. 27,999)\n\n• Pull-up leather with elastic side panels\n• Cushioned insole for all-day comfort\n• Rubber outsole for grip\n• Available sizes: 39-44\n• Colors: Brown and Black\n\nClassic style that goes with everything!"
    
    # Backpack specific
    elif "backpack" in msg:
        return "🎒 **Leather Backpack** - Rs. 12,999\n\n• Full-grain cowhide leather\n• Padded laptop sleeve (fits 15-inch)\n• Drawstring closure with magnetic flap\n• One size (18″ x 12″ x 5″)\n• Colors: Brown, Black, Tan\n\nPerfect for work, travel, or college!"
    
    # Care questions
    elif "care" in msg or "clean" in msg or "maintain" in msg:
        return "🧼 **Leather Care Tips:**\n\n1. **Cleaning:** Wipe with soft damp cloth - never soak!\n2. **Conditioning:** Apply leather conditioner every 3-6 months\n3. **Water:** Apply waterproof spray, air dry naturally if wet\n4. **Storage:** Cool, dry place away from sunlight\n5. **Scratches:** Minor scratches can be rubbed out with finger\n\nOur products last 5-10+ years with proper care! ✨"
    
    # Gift questions
    elif "gift" in msg or "present" in msg or "father" in msg or "dad" in msg:
        return "🎁 **Gift Recommendations:**\n\n• **Under Rs. 5,000:** Classic Leather Belt (Rs. 3,999) or Minimalist Wallet (Rs. 2,499)\n• **Rs. 10,000-20,000:** Handcrafted Tote Bag (Rs. 15,999) or Leather Backpack (Rs. 12,999) or Chelsea Boots (Rs. 18,999)\n• **Premium Gift:** Premium Leather Jacket (Rs. 29,999)\n\nAll come in elegant packaging! Would you like more details on any?"
    
    # Price questions
    elif "price" in msg or "cost" in msg or "how much" in msg:
        return "💰 **Price List:**\n\n• Premium Leather Jacket: Rs. 29,999 (was Rs. 44,999)\n• Handcrafted Tote Bag: Rs. 15,999\n• Classic Leather Belt: Rs. 3,999\n• Minimalist Wallet: Rs. 2,499 (was Rs. 3,999)\n• Leather Chelsea Boots: Rs. 18,999 (was Rs. 27,999)\n• Leather Backpack: Rs. 12,999\n\nFree shipping on orders over Rs. 5,000! ✨"
    
    # Shipping/Returns
    elif "shipping" in msg or "delivery" in msg:
        return COMPANY_INFO["shipping"]
    
    elif "return" in msg:
        return COMPANY_INFO["returns"]
    
    # Default greeting
    else:
        return f"👋 Hello! I'm your RANA LEATHER'S assistant. I can help you with:\n\n• **Product details** (jackets, bags, belts, wallets, boots, backpacks)\n• **Prices** (from Rs. 2,499 to Rs. 29,999)\n• **Leather knowledge** (types, care, differences)\n• **Gift recommendations**\n• **Shipping and returns**\n\nWhat would you like to know? ✨"

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        print(f"\n📝 User: {request.message}")
        
        # Use intelligent response system
        bot_response = get_intelligent_response(request.message)
        sources = ["Product Guide"]
        
        print(f"✅ Used Intelligent Response")
        
        # Save to history
        if request.session_id not in chat_history:
            chat_history[request.session_id] = []
        chat_history[request.session_id].append({
            "user": request.message,
            "bot": bot_response,
            "time": datetime.now().isoformat()
        })
        
        return ChatResponse(response=bot_response, sources=sources, session_id=request.session_id)
        
    except Exception as e:
        print(f"Error: {e}")
        return ChatResponse(
            response=f"Please email {COMPANY_INFO['contact']} for assistance. What specific information do you need about our leather products?",
            sources=["Support"],
            session_id=request.session_id
        )

@app.get("/api/chat/history/{session_id}")
async def get_history(session_id: str):
    return chat_history.get(session_id, [])

@app.delete("/api/chat/history/{session_id}")
async def clear_history(session_id: str):
    if session_id in chat_history:
        chat_history[session_id] = []
    return {"message": "Chat history cleared"}

@app.get("/api/health")
async def health():
    return {"status": "healthy", "products": len(PRODUCTS)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
