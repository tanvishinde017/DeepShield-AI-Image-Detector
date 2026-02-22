import tensorflow as tf
import numpy as np
import os

MODEL_PATH = "models/model.keras"
VAL_DIR = "dataset/val"

model = tf.keras.models.load_model(MODEL_PATH)

scores = []

for label in ["fake", "real"]:
    folder = os.path.join(VAL_DIR, label)

    for file in os.listdir(folder):
        path = os.path.join(folder, file)

        img = tf.keras.preprocessing.image.load_img(path, target_size=(224,224))
        img = tf.keras.preprocessing.image.img_to_array(img) / 255.0
        img = np.expand_dims(img, axis=0)

        score = float(model.predict(img, verbose=0)[0][0])
        scores.append(score)

print("Min:", min(scores))
print("Max:", max(scores))
print("Mean:", sum(scores)/len(scores))