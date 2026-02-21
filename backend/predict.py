import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

import tensorflow as tf
import numpy as np
import json
import sys
from tensorflow.keras.preprocessing import image

IMG_SIZE = 224
MODEL_PATH = "models/best_model.keras"

# Load model
model = tf.keras.models.load_model(MODEL_PATH)

# Load threshold
try:
    with open("models/config.json") as f:
        config = json.load(f)
        THRESHOLD = config.get("threshold", 0.5)
except:
    THRESHOLD = 0.5


def predict_image(img_path, return_raw=False):

    img = image.load_img(img_path, target_size=(IMG_SIZE, IMG_SIZE))
    img_array = image.img_to_array(img)
    img_array = img_array / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = float(model.predict(img_array, verbose=0)[0][0])

    label = "Real" if prediction >= THRESHOLD else "AI Generated"

    confidence = prediction if label == "Real" else (1 - prediction)
    confidence_percent = round(confidence * 100, 2)

    if return_raw:
        return label, confidence_percent, prediction

    return label, confidence_percent


# ==============================
# MAIN EXECUTION BLOCK
# ==============================

if __name__ == "__main__":

    if len(sys.argv) < 2:
        print("Usage: python predict.py <image_path>")
        sys.exit()

    image_path = sys.argv[1]

    label, confidence = predict_image(image_path)

    print("\n===== DeepShield Prediction =====")
    print("Image:", image_path)
    print("Prediction:", label)
    print("Confidence:", confidence, "%")
    