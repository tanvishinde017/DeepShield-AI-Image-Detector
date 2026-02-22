import tensorflow as tf
import numpy as np
import os
from tensorflow.keras.preprocessing import image

MODEL_PATH = "models/deepshield_best.keras"   # <-- correct model name
TEST_DIR = "dataset/test_new"
IMG_SIZE = 224

model = tf.keras.models.load_model(MODEL_PATH)

print("🔎 Testing on NEW unseen images\n")

total = 0
correct = 0

for label in ["fake", "real"]:
    folder = os.path.join(TEST_DIR, label)

    for file in os.listdir(folder):
        path = os.path.join(folder, file)

        img = image.load_img(path, target_size=(IMG_SIZE, IMG_SIZE))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)

        # ✅ VERY IMPORTANT: same preprocessing as training
        img_array = tf.keras.applications.mobilenet_v2.preprocess_input(img_array)

        prediction = float(model.predict(img_array, verbose=0)[0][0])
        predicted_label = "real" if prediction >= 0.5 else "fake"

        print(f"Image: {file}")
        print("Actual:", label)
        print("Predicted:", predicted_label)
        print("Confidence:", round(prediction if prediction >= 0.5 else 1-prediction, 4))
        print("-" * 40)

        total += 1
        if predicted_label == label:
            correct += 1

print("\n============================")
print("Total Images:", total)
print("Correct Predictions:", correct)
print("Accuracy:", round((correct / total) * 100, 2), "%")
print("============================")