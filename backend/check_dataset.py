import os

train_path = "dataset/train"

for cls in os.listdir(train_path):
    count = len(os.listdir(os.path.join(train_path, cls)))
    print(cls, count)