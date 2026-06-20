import sys
try:
    from PyPDF2 import PdfReader
    reader = PdfReader(r"C:\Users\14169\portfolio\references\时尚設計2_金承旭_1230014532_D2.pdf")
    print(f"Pages: {len(reader.pages)}")
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            print(f"\n=== Page {i+1} ===")
            print(text[:2000])
except Exception as e:
    print(f"Error: {e}")
