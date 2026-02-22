import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
import os

print("🚀 DeepShield AI Perfect Training Starting...")

# =========================
# Configuration
# =========================

DATASET_PATH = "dataset"
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "deepshield_best.keras")

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS_HEAD = 5
EPOCHS_FINE = 5

# Create models folder if not exists
os.makedirs(MODEL_DIR, exist_ok=True)

# =========================
# Load Dataset
# =========================

train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    os.path.join(DATASET_PATH, "train"),
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True
)

val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    os.path.join(DATASET_PATH, "val"),
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False
)

AUTOTUNE = tf.data.AUTOTUNE
train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)

# =========================
# Build Model
# =========================

base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet"
)

base_model.trainable = False

inputs = keras.Input(shape=(224, 224, 3))

# Correct preprocessing
x = tf.keras.applications.mobilenet_v2.preprocess_input(inputs)

x = base_model(x, training=False)
x = layers.GlobalAveragePooling2D()(x)
x = layers.BatchNormalization()(x)
x = layers.Dropout(0.4)(x)
outputs = layers.Dense(1, activation="sigmoid")(x)

model = keras.Model(inputs, outputs)

# =========================
# Compile Phase 1
# =========================

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-4),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.summary()

callbacks = [
    keras.callbacks.ModelCheckpoint(
        MODEL_PATH,
        save_best_only=True,
        monitor="val_accuracy",
        mode="max"
    ),
    keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=3,
        restore_best_weights=True
    )
]

# =========================
# Phase 1: Train Head
# =========================

print("\n🔥 Training Classification Head...\n")

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS_HEAD,
    callbacks=callbacks
)

# =========================
# Phase 2: Fine Tune
# =========================

print("\n🔥 Fine-Tuning Last 30 Layers...\n")

base_model.trainable = True

for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=1e-5),
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS_FINE,
    callbacks=callbacks
)

model.save(MODEL_PATH)

print("\n🎉 DeepShield AI Training Complete!")
print("✅ Model saved at:", MODEL_PATH)