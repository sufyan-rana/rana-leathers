import os
import dotenv
from google import genai
from google.genai import types
import qdrant_client
from qdrant_client.models import VectorParams, Distance, PointStruct
from products_data import products, company_info
import uuid

# Load environment variables
dotenv.load_dotenv()

# Initialize Gemini client (new SDK)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize Qdrant
qdrant_client = qdrant_client.QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY"),
)

# Create collection if not exists
collection_name = "rana_leathers_products"

try:
    qdrant_client.get_collection(collection_name)
    print(f"Collection {collection_name} already exists. Deleting...")
    qdrant_client.delete_collection(collection_name)
except:
    print(f"Creating new collection: {collection_name}")

# Create collection with 768 dimensions (for text-embedding-004 model)
qdrant_client.create_collection(
    collection_name=collection_name,
    vectors_config=VectorParams(size=768, distance=Distance.COSINE),
)

# Helper function to get embedding using new SDK
def get_embedding(text: str) -> list:
    """Generate embedding using Google's text-embedding-004 model"""
    response = client.models.embed_content(
        model="models/text-embedding-004",
        contents=[text],
        config=types.EmbedContentConfig(task_type="RETRIEVAL_DOCUMENT")
    )
    return response.embeddings[0].values

print(f"Indexing {len(products)} products...")

# Generate embeddings and upload products
for product in products:
    # Create text to embed
    text_to_embed = f"""
    Product: {product['name']}
    Category: {product['category']}
    Price: Rs. {product['price']}
    Description: {product['description']}
    Features: {', '.join(product['features'])}
    Care Instructions: {product['care']}
    """
    
    # Generate embedding
    embedding = get_embedding(text_to_embed)
    
    # Create point
    point = PointStruct(
        id=product['id'],
        vector=embedding,
        payload={
            "product_id": product['id'],
            "name": product['name'],
            "category": product['category'],
            "price": product['price'],
            "description": product['description'],
            "features": product['features'],
            "care": product['care'],
            "text": text_to_embed
        }
    )
    
    qdrant_client.upsert(
        collection_name=collection_name,
        points=[point]
    )
    
    print(f"✓ Indexed: {product['name']}")

# Add company info as a separate point
company_text = f"""
Company: {company_info['name']}
Established: {company_info['established']}
Location: {company_info['location']}
Mission: {company_info['mission']}
Shipping Policy: {company_info['shipping']}
Return Policy: {company_info['returns']}
Warranty: {company_info['warranty']}
"""

company_embedding = get_embedding(company_text)

company_point = PointStruct(
    id=999,
    vector=company_embedding,
    payload={
        "type": "company_info",
        "text": company_text,
        **company_info
    }
)

qdrant_client.upsert(
    collection_name=collection_name,
    points=[company_point]
)

print("✓ Indexed: Company Information")
print(f"\n✅ Successfully indexed {len(products) + 1} items to Qdrant!")
