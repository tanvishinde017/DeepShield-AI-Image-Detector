import os
import random

def trim_folder(real_path, fake_path):
    real_images = os.listdir(real_path)
    fake_images = os.listdir(fake_path)

    real_count = len(real_images)
    fake_count = len(fake_images)

    print(f"\nChecking: {real_path} & {fake_path}")
    print(f"Real: {real_count}")
    print(f"Fake: {fake_count}")

    if real_count == fake_count:
        print("Already balanced ✅")
        return

    # Find smaller count
    min_count = min(real_count, fake_count)

    # Trim real if needed
    if real_count > min_count:
        extra_real = random.sample(real_images, real_count - min_count)
        for img in extra_real:
            os.remove(os.path.join(real_path, img))
        print(f"Removed {len(extra_real)} images from REAL")

    # Trim fake if needed
    if fake_count > min_count:
        extra_fake = random.sample(fake_images, fake_count - min_count)
        for img in extra_fake:
            os.remove(os.path.join(fake_path, img))
        print(f"Removed {len(extra_fake)} images from FAKE")

    print("Balanced successfully ✅")


# TRAIN
trim_folder(
    "dataset/train/real",
    "dataset/train/fake"
)

# VALIDATION
trim_folder(
    "dataset/val/real",
    "dataset/val/fake"
)