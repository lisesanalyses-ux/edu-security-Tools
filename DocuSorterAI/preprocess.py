import os
import re
import pandas as pd
from PyPDF2 import PdfReader
from docx import Document
import spacy
from spacy.lang.cs.stop_words import STOP_WORDS
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Czech language model
try:
    nlp = spacy.load('cs_core_news_sm')
except OSError:
    logger.warning("Czech model not found. Installing...")
    os.system('python -m spacy download cs_core_news_sm')
    nlp = spacy.load('en_core_web_sm')

def extract_text_from_pdf(file_path):
    """
    Extract text from PDF file.

    Args:
        file_path (str): Path to PDF file

    Returns:
        str: Extracted text
    """
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from PDF {file_path}: {e}")
        return ""

def extract_text_from_docx(file_path):
    """
    Extract text from DOCX file.

    Args:
        file_path (str): Path to DOCX file

    Returns:
        str: Extracted text
    """
    try:
        doc = Document(file_path)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text.strip()
    except Exception as e:
        logger.error(f"Error extracting text from DOCX {file_path}: {e}")
        return ""

def extract_text_from_file(file_path):
    """
    Extract text from file based on extension.

    Args:
        file_path (str): Path to file

    Returns:
        str: Extracted text
    """
    _, ext = os.path.splitext(file_path.lower())

    if ext == '.pdf':
        return extract_text_from_pdf(file_path)
    elif ext == '.docx':
        return extract_text_from_docx(file_path)
    else:
        logger.warning(f"Unsupported file type: {ext}")
        return ""

def clean_text(text):
    """
    Clean and preprocess text.

    Args:
        text (str): Raw text

    Returns:
        str: Cleaned text
    """
    if not text:
        return ""

    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)

    # Remove special characters but keep Czech characters
    text = re.sub(r'[^\w\sáčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]', ' ', text)

    # Convert to lowercase
    text = text.lower().strip()

    return text

def tokenize_and_lemmatize(text):
    """
    Tokenize and lemmatize text using spaCy.

    Args:
        text (str): Cleaned text

    Returns:
        list: List of lemmatized tokens
    """
    if not text:
        return []

    doc = nlp(text)

    # Remove stop words and punctuation, keep only alphabetic tokens
    tokens = [token.lemma_ for token in doc
              if token.is_alpha and token.text not in STOP_WORDS]

    return tokens

def preprocess_text(text):
    """
    Complete text preprocessing pipeline.

    Args:
        text (str): Raw text

    Returns:
        str: Preprocessed text (lemmatized tokens joined by space)
    """
    cleaned = clean_text(text)
    tokens = tokenize_and_lemmatize(cleaned)
    return ' '.join(tokens)

def process_directory(directory_path, output_csv='training_data.csv'):
    """
    Process all PDF and DOCX files in directory and create training dataset.

    Args:
        directory_path (str): Path to directory with documents
        output_csv (str): Output CSV file path

    Returns:
        pd.DataFrame: Training dataset
    """
    data = []

    # Walk through directory
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)

            # Extract text
            text = extract_text_from_file(file_path)
            if not text:
                continue

            # Preprocess text
            processed_text = preprocess_text(text)

            # Determine category from directory structure
            # Assuming directory name is the category
            category = os.path.basename(root)

            data.append({
                'file_path': file_path,
                'raw_text': text,
                'processed_text': processed_text,
                'category': category
            })

    # Create DataFrame
    df = pd.DataFrame(data)

    # Save to CSV
    if not df.empty:
        df.to_csv(output_csv, index=False, encoding='utf-8')
        logger.info(f"Training data saved to {output_csv}")

    return df

if __name__ == "__main__":
    # Example usage
    sample_text = "Toto je ukázkový text pro testování předzpracování."
    processed = preprocess_text(sample_text)
    print(f"Original: {sample_text}")
    print(f"Processed: {processed}")

    # Process sample data directory to create training dataset
    sample_data_dir = 'sample_data'
    if os.path.exists(sample_data_dir):
        df = process_directory(sample_data_dir, 'training_data.csv')
        print(f"Training dataset created with {len(df)} samples")
        print(df.head())
    else:
        print(f"Sample data directory '{sample_data_dir}' not found")
