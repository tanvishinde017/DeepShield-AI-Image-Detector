import tensorflow as tf
import numpy as np
import json
from sklearn.metrics import confusion_matrix, classification_report

MODEL_PATH = "models/best_model.keras"
VAL_DIR = "dataset/val"
IMG_SIZE = 224
BATCH_SIZE = 16

print("🔄 Loading model...")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

print("📂 Loading validation dataset...")
val_ds = tf.keras.utils.image_dataset_from_directory(
    VAL_DIR,
    image_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    shuffle=False
)

# normalize same as training
val_ds = val_ds.map(lambda x, y: (x / 255.0, y))

all_preds = []
all_labels = []

print("🔎 Running predictions...")

for images, labels in val_ds:
    preds = model.predict(images, verbose=0)
    all_preds.extend(preds.flatten())
    all_labels.extend(labels.numpy())

all_preds = np.array(all_preds)
all_labels = np.array(all_labels)

print("\n🔍 Searching best threshold...")

best_acc = 0
best_threshold = 0.5

for t in np.arange(0.30, 0.80, 0.01):
    predicted_labels = (all_preds >= t).astype(int)
    acc = np.mean(predicted_labels == all_labels)

    if acc > best_acc:
        best_acc = acc
        best_threshold = float(t)

print("\n✅ Best Threshold:", round(best_threshold, 3))
print("✅ Best Accuracy:", round(best_acc, 4))

final_preds = (all_preds >= best_threshold).astype(int)

print("\n📊 Confusion Matrix:")
print(confusion_matrix(all_labels, final_preds))

print("\n📄 Classification Report:")
print(classification_report(
    all_labels,
    final_preds,
    target_names=["Fake", "Real"]
))

with open("models/config.json", "w") as f:
    json.dump({"threshold": best_threshold}, f)

print("\n💾 Threshold saved to models/config.json")