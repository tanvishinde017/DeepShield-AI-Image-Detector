import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image

IMG_SIZE = 224
MODEL_PATH = "models/best_model.keras"
TEST_FOLDER = "models/test_images"   # change if needed

print("🔄 Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("✅ Model loaded!\n")

for file in os.listdir(TEST_FOLDER):

    path = os.path.join(TEST_FOLDER, file)

    img = image.load_img(path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)

    # SAME preprocessing as training
    img_array = img_array / 255.0

    img_array = np.expand_dims(img_array, axis=0)

    prediction = float(model.predict(img_array, verbose=0)[0][0])

    label = "Real" if prediction >= 0.5 else "Fake"
    confidence = prediction if label == "Real" else (1 - prediction)

    print(f"📷 {file}")
    print("Score:", round(prediction, 4))
    print("Prediction:", label)
    print("Confidence:", round(confidence * 100, 2), "%")
    print("-" * 40)