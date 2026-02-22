import os
import json
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

print("🚀 Starting DeepShield Training...")

# ==============================
# Paths
# ==============================
TRAIN_DIR = "dataset/train"
VAL_DIR = "dataset/val"
MODEL_PATH = "models/best_model.keras"
HISTORY_PATH = "models/history.json"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 6

# ==============================
# Load Dataset
# ==============================
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    TRAIN_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    VAL_DIR,
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE
)

class_names = train_ds.class_names
print("Classes:", class_names)

# Normalize
normalization_layer = layers.Rescaling(1./255)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))

# ==============================
# Build Model
# ==============================
model = keras.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)),
    layers.MaxPooling2D(),

    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Conv2D(128, (3,3), activation='relu'),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(1, activation='sigmoid')
])

model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ==============================
# Callbacks
# ==============================
checkpoint = keras.callbacks.ModelCheckpoint(
    MODEL_PATH,
    monitor='val_accuracy',
    save_best_only=True,
    mode='max',
    verbose=1
)

early_stop = keras.callbacks.EarlyStopping(
    monitor='val_loss',
    patience=2,
    restore_best_weights=True
)

# ==============================
# Train
# ==============================
history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS,
    callbacks=[checkpoint, early_stop]
)

# ==============================
# Fix JSON Error (IMPORTANT)
# ==============================
history_dict = {}

for key, value in history.history.items():
    history_dict[key] = [float(v) for v in value]   # convert tensors to float

with open(HISTORY_PATH, "w") as f:
    json.dump(history_dict, f)

print("✅ Training Complete!")
print("✅ Best model saved at:", MODEL_PATH)
print("✅ History saved at:", HISTORY_PATH)