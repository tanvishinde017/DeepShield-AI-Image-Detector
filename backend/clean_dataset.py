# DeepShield Dataset Cleaner 
import os
from PIL import Image
from tqdm import tqdm

def clean_and_fix_images(folder_path):
    removed = 0
    fixed = 0

    print("🔍 Deep Cleaning Dataset...")

    for root, dirs, files in os.walk(folder_path):
        for file in tqdm(files):
            if not file.lower().endswith((".jpg", ".jpeg", ".png")):
                continue

            file_path = os.path.join(root, file)

            try:
                with Image.open(file_path) as img:
                    img = img.convert("RGB")  # Force RGB
                    img.save(file_path, "JPEG", quality=95)  # Re-save cleanly
                    fixed += 1
            except Exception:
                print(f"❌ Removing corrupted: {file_path}")
                os.remove(file_path)
                removed += 1

    print(f"\n✅ Fixed images: {fixed}")
    print(f"❌ Removed corrupted images: {removed}")

# 🔁 CHANGE THIS IF NEEDED
clean_and_fix_images("dataset")
