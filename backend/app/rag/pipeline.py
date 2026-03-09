import os
from langchain_community.document_loaders import TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.rag.retriever import get_vector_store

def ingest_documents(directory_path: str):
    """Loads documents from a directory, chunks them, and adds them to pgvector."""
    documents = []
    
    for filename in os.listdir(directory_path):
        file_path = os.path.join(directory_path, filename)
        if filename.endswith(".txt"):
            loader = TextLoader(file_path)
            documents.extend(loader.load())
        elif filename.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
            documents.extend(loader.load())
            
    if not documents:
        return 0
        
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        add_start_index=True,
    )
    
    chunks = text_splitter.split_documents(documents)
    
    vector_store = get_vector_store()
    vector_store.add_documents(chunks)
    
    return len(chunks)
