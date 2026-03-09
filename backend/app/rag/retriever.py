from langchain_aws import BedrockEmbeddings
from langchain_chroma import Chroma
from app.config import settings

def get_vector_store():
    # Bedrock Embeddings
    embeddings = BedrockEmbeddings(
        model_id="amazon.titan-embed-text-v2:0",
        region_name=settings.AWS_REGION
    )
    
    # Configure Chroma (Local SQLite-based vector store)
    vector_store = Chroma(
        collection_name="rag_documents",
        embedding_function=embeddings,
        persist_directory="./chroma_db"
    )
    return vector_store

def get_retriever():
    store = get_vector_store()
    return store.as_retriever(search_kwargs={"k": 5})
