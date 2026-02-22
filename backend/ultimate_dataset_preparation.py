import os
import hashlib
import random
import shutil
import time
from PIL import Image
from tqdm import tqdm

RAW_PATH = "raw_dataset"
OUTPUT_PATH = "dataset"

MIN_WIDTH = 128
MIN_HEIGHT = 128

TRAIN_SPLIT = 0.7
VAL_SPLIT = 0.15

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png")


# ==============================
# SAFE DELETE FUNCTION (Windows Fix)
# ==============================

def safe_remove(path):
    for _ in range(3):  # retry 3 times
        try:
            if os.path.exists(path):
                os.chmod(path, 0o777)  # remove read-only flag
                os.remove(path)
            return True
        except PermissionError:
            time.sleep(0.2)
    print(f"⚠ Could not delete: {path}")
    return False


def get_hash(filepath):
    with open(filepath, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()


def clean_folder(folder_path):
    print(f"\n🔍 Cleaning {folder_path}")

    hashes = set()
    removed = {
        "duplicate": 0,
        "corrupted": 0,
        "small": 0,
        "invalid": 0
    }

    files = list(os.listdir(folder_path))

    for file in tqdm(files):
        file_path = os.path.join(folder_path, file)

        if not os.path.isfile(file_path):
            continue

        # Invalid extension
        if not file.lower().endswith(VALID_EXTENSIONS):
            if safe_remove(file_path):
                removed["invalid"] += 1
            continue

        # Corrupted check
        try:
            with Image.open(file_path) as img:
                img.verify()
        except:
            if safe_remove(file_path):
                removed["corrupted"] += 1
            continue

        # Size check
        try:
            with Image.open(file_path) as img:
                width, height = img.size
        except:
            if safe_remove(file_path):
                removed["corrupted"] += 1
            continue

        if width < MIN_WIDTH or height < MIN_HEIGHT:
            if safe_remove(file_path):
                removed["small"] += 1
            continue

        # Duplicate check
        try:
            file_hash = get_hash(file_path)
            if file_hash in hashes:
                if safe_remove(file_path):
                    removed["duplicate"] += 1
            else:
                hashes.add(file_hash)
        except:
            continue

    print("Removed:", removed)


def count_images(folder):
    return len([f for f in os.listdir(folder)
                if f.lower().endswith(VALID_EXTENSIONS)])


def balance_dataset(fake_path, real_path):
    fake_images = [f for f in os.listdir(fake_path)
                   if f.lower().endswith(VALID_EXTENSIONS)]
    real_images = [f for f in os.listdir(real_path)
                   if f.lower().endswith(VALID_EXTENSIONS)]

    print("\n📊 Before Balancing")
    print("Fake:", len(fake_images))
    print("Real:", len(real_images))

    min_count = min(len(fake_images), len(real_images))

    for f in random.sample(fake_images, len(fake_images) - min_count):
        safe_remove(os.path.join(fake_path, f))

    for f in random.sample(real_images, len(real_images) - min_count):
        safe_remove(os.path.join(real_path, f))

    print("\n📊 After Balancing")
    print("Fake:", count_images(fake_path))
    print("Real:", count_images(real_path))


def create_split_folders():
    for split in ["train", "val", "test"]:
        for cls in ["fake", "real"]:
            os.makedirs(os.path.join(OUTPUT_PATH, split, cls), exist_ok=True)


def split_dataset(class_name):
    source_folder = os.path.join(RAW_PATH, class_name)
    images = [f for f in os.listdir(source_folder)
              if f.lower().endswith(VALID_EXTENSIONS)]

    random.shuffle(images)

    total = len(images)
    train_end = int(total * TRAIN_SPLIT)
    val_end = train_end + int(total * VAL_SPLIT)

    train_files = images[:train_end]
    val_files = images[train_end:val_end]
    test_files = images[val_end:]

    for f in train_files:
        shutil.copy(os.path.join(source_folder, f),
                    os.path.join(OUTPUT_PATH, "train", class_name, f))

    for f in val_files:
        shutil.copy(os.path.join(source_folder, f),
                    os.path.join(OUTPUT_PATH, "val", class_name, f))

    for f in test_files:
        shutil.copy(os.path.join(source_folder, f),
                    os.path.join(OUTPUT_PATH, "test", class_name, f))

    print(f"\n📂 {class_name} split:")
    print("Train:", len(train_files))
    print("Val:", len(val_files))
    print("Test:", len(test_files))


# ==============================
# MAIN
# ==============================

if __name__ == "__main__":

    print("🚀 Starting Ultimate Dataset Preparation...")

    fake_folder = os.path.join(RAW_PATH, "fake")
    real_folder = os.path.join(RAW_PATH, "real")

    if not os.path.exists(fake_folder) or not os.path.exists(real_folder):
        print("❌ raw_dataset/fake and raw_dataset/real must exist.")
        exit()

    clean_folder(fake_folder)
    clean_folder(real_folder)

    print("\n📊 After Cleaning:")
    print("Fake:", count_images(fake_folder))
    print("Real:", count_images(real_folder))

    balance_dataset(fake_folder, real_folder)

    create_split_folders()

    split_dataset("fake")
    split_dataset("real")

    print("\n🎉 Dataset Ready for Training!")