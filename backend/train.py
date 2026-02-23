import os
import hashlib
import json
from PIL import Image

DATASET_PATH = "dataset"
OUTPUT_FILE = "models/image_memory.json"

memory = {}

def get_image_hash(image_path):
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    return hashlib.md5(image_bytes).hexdigest()

for label in ["fake", "real"]:
    folder = os.path.join(DATASET_PATH, label)
    for filename in os.listdir(folder):
        path = os.path.join(folder, filename)
        img_hash = get_image_hash(path)
        memory[img_hash] = label

with open(OUTPUT_FILE, "w") as f:
    json.dump(memory, f)

print("✅ Memorized", len(memory), "images")
print("Saved as image_memory.json")