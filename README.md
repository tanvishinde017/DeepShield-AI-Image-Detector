🛡️ DeepShield – AI Image & Video Detection System

DeepShield is a deep learning-powered web application that detects whether an image or video is AI-generated or real.
Built with a modern full-stack architecture, DeepShield combines computer vision, deep learning, and web technologies to provide a fast and intuitive detection system.

🚀 Live Demo
🌐 Frontend (Vercel):
https://deep-shield-ai-image-detector.vercel.app
⚙️ Backend (Render):
https://deepshield-ai-image-detector-1.onrender.com


✨ Features
✅ AI vs Real classification
📊 Confidence score with probability meter
🎨 Color-based result:
🔴 Red → AI Generated
🟢 Green → Real
📅 Timestamp of analysis

🎥 Video frame-by-frame analysis
⚡ Fast API response with optimized model
📱 Fully responsive UI

🧠 How It Works
User uploads an image or video
Backend preprocesses the media using OpenCV
Frames/images are normalized and resized
Model predicts probability using MobileNetV2
Smart threshold logic determines:
AI Generated
Real
Result is returned with confidence score and displayed on UI

🏗️ Tech Stack

🎨 Frontend
React.js
Axios
CSS3
Responsive Design

⚙️ Backend
Flask
TensorFlow / Keras
OpenCV
NumPy

🤖 Model
MobileNetV2 (Pretrained on ImageNet)
Transfer Learning
Fine-tuning
Data Augmentation

📂 Project Structure
DeepShield/
│
├── backend/
│   ├── app.py
│   ├── train_model.py
│   ├── models/
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
⚙️ Backend Setup
cd backend
pip install -r requirements.txt
python app.py

🔗 Backend runs at:

http://localhost:5000
🎨 Frontend Setup
cd frontend
npm install
npm start

🔗 Frontend runs at:

http://localhost:3000
🧪 Model Training

To retrain the model:

python train_model.py
📁 Dataset Structure
dataset/
│
├── train/
│   ├── real/
│   └── fake/
│
├── validation/
│   ├── real/
│   └── fake/
📦 Backend Requirements

Create backend/requirements.txt:

Flask==3.0.2
flask-cors==4.0.0
tensorflow==2.15.0
numpy==1.26.4
opencv-python==4.9.0.80
Pillow==10.2.0

✅ Compatible with Python 3.10 / 3.11

📦 Frontend Dependencies

Inside frontend/package.json:

"dependencies": {
  "axios": "^1.6.7",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.2",
  "react-scripts": "5.0.1"
}

Then run:

npm install
☁️ Deployment
🔹 Frontend
Platform: Vercel
Auto-deploy from GitHub
🔹 Backend
Platform: Render
Flask API deployed with environment configuration
📈 Future Improvements
🔍 Larger dataset (10K+ images)
🤖 Ensemble models for higher accuracy
🔥 Explainable AI (Grad-CAM heatmaps)
☁️ Full cloud deployment (AWS / Azure)
🔐 User authentication system
📊 Analytics dashboard
👩‍💻 Author

Tanavi Shinde
🎓 BSc IT Student
💡 AI | DevOps | Full Stack Enthusiast

Building intelligent systems with modern architecture 🚀

⭐ Support

If you like this project:
⭐ Star the repository
🍴 Fork it
🛠️ Contribute

📜 License

This project is open-source and available under the MIT License.
