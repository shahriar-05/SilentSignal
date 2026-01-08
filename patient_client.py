import cv2
import numpy as np
import requests
import time
from datetime import datetime
from tensorflow.keras.models import load_model

# Configuration
SERVER_URL = "http://localhost:5000"  # Change this to your server URL
PATIENT_ID = "patient_001"  # Change this to unique patient ID
SEND_INTERVAL = 5  # Send data every 5 seconds

# 1. SETUP: Load resources BEFORE the loop starts
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

# Load your pre-trained model
try:
    model = load_model("fer.h5")
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error: Could not load 'fer.h5'. {e}")
    exit(1)

# Data mapping
emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
emotion_score = {
    'Happy': 80, 'Neutral': 50, 'Surprise': 60, 
    'Sad': 20, 'Angry': 25, 'Fear': 15, 'Disgust': 10
}

def send_mood_data(emotion, score, confidence):
    """Send mood data to the server"""
    try:
        data = {
            'patient_id': PATIENT_ID,
            'emotion': emotion,
            'score': int(score),
            'confidence': float(confidence),
            'timestamp': datetime.now().isoformat()
        }
        response = requests.post(f"{SERVER_URL}/api/mood", json=data, timeout=2)
        if response.status_code == 200:
            print(f"✓ Sent: {emotion} (Score: {score})")
        else:
            print(f"✗ Failed to send data: {response.status_code}")
    except requests.exceptions.RequestException as e:
        print(f"✗ Connection error: {e}")

# 2. INITIALIZE CAMERA
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit(1)

print(f"Camera initialized. Sending data to {SERVER_URL}")
print("Press 'q' to quit.")

last_send_time = time.time()
frame_count = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    
    # 3. PROCESSING: Convert to grayscale for Haar Cascade
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    current_emotion = None
    current_score = None
    current_confidence = None

    # 4. INFERENCE: Predict for every face found in the current frame
    for (x, y, w, h) in faces:
        # Extract the region of interest (the face)
        roi_gray = gray[y:y+h, x:x+w]
        
        # Preprocessing to match model input (48x48, normalized, reshaped)
        roi_gray = cv2.resize(roi_gray, (48, 48))
        roi_gray = roi_gray / 255.0
        roi_gray = np.reshape(roi_gray, (1, 48, 48, 1))

        # Perform prediction
        prediction = model.predict(roi_gray, verbose=0)
        max_index = np.argmax(prediction)
        emotion = emotions[max_index]
        confidence = prediction[0][max_index]
        score = emotion_score[emotion]

        current_emotion = emotion
        current_score = score
        current_confidence = confidence

        # 5. VISUALIZATION: Draw results on the live frame
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        label = f"{emotion} (Score: {score}, Conf: {confidence:.2f})"
        cv2.putText(frame, label, (x, y-10), 
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    # Send data to server at specified intervals
    current_time = time.time()
    if current_emotion and (current_time - last_send_time) >= SEND_INTERVAL:
        send_mood_data(current_emotion, current_score, current_confidence)
        last_send_time = current_time

    # Display status
    status_text = f"Frames: {frame_count} | Patient: {PATIENT_ID}"
    cv2.putText(frame, status_text, (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    # Display the final output window
    cv2.imshow("Patient Emotion Monitor", frame)

    # Break loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 6. CLEANUP
cap.release()
cv2.destroyAllWindows()
print("Camera released. Goodbye!")

