<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# 🛡️ DeepShield – AI Image & Video Detection System

DeepShield is a deep learning based web application that detects whether an image or video is AI-generated or real.

It uses a fine-tuned MobileNetV2 model trained on real vs AI-generated datasets and provides:

- ✅ AI / Real classification
- 📊 Confidence percentage meter
- 🎨 Red (AI) / Green (Real) result indication
- 📅 Date & time of analysis
- 🎥 Video frame analysis support
- 🚀 Modern React frontend + Flask backend

---

## 🧠 How It Works

1. User uploads image or video
2. Backend preprocesses media
3. Model predicts probability
4. Smart threshold logic determines label
5. Result displayed with confidence meter

---

## 🏗️ Tech Stack

### Frontend
- React
- Axios
- CSS3
- Responsive UI

### Backend
- Flask
- TensorFlow / Keras
- OpenCV
- NumPy

### Model
- MobileNetV2 (Pretrained on ImageNet)
- Transfer Learning + Fine Tuning
- Data Augmentation

---

## 📂 Project Structure

DeepShield/
│
├── backend/
│ ├── app.py
│ ├── train_model.py
│ ├── models/
│ ├── uploads/
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ ├── public/
│ └── package.json
│
└── README.md


---

## ⚙️ Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py

Server runs at:

http://localhost:5000

🎨 Frontend Setup
cd frontend
npm install
npm start


Frontend runs at:

http://localhost:3000

🧪 Model Training

To retrain model:

python train_model.py


Make sure dataset structure:

dataset/
│
├── train/
│   ├── real/
│   └── fake/
│
├── validation/
│   ├── real/
│   └── fake/

📈 Future Improvements

Larger dataset (10K+ images)

Ensemble models

Explainable AI heatmaps

Cloud deployment

Authentication system

👩‍💻 Author

Tanavi Shinde
BSc IT | AI & DevOps Enthusiast
Building intelligent systems with modern full-stack architecture 🚀


---

# ✅ 2️⃣ backend/requirements.txt

Create this file inside backend folder:

```txt
Flask==3.0.2
flask-cors==4.0.0
tensorflow==2.15.0
numpy==1.26.4
opencv-python==4.9.0.80
Pillow==10.2.0


If using Python 3.10 or 3.11 → this works perfectly.

✅ 3️⃣ frontend/package.json Dependencies

Inside frontend package.json, ensure this:

"dependencies": {
  "axios": "^1.6.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.2",
  "react-scripts": "5.0.1"
}


Then run:

npm install
>>>>>>> e01c9e7984ccd6ee48a85e718bdd67393259662e
