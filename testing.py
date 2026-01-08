import cv2
from tensorflow.keras.models import load_model
import numpy as np

# 1. SETUP: Load resources BEFORE the loop starts
# This ensures everything is ready before we start capturing frames
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

# Emotion labels and scoring
emotions = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral']
emotion_score = {
    'Happy': 80,
    'Neutral': 50,
    'Surprise': 60,
    'Sad': 20,
    'Angry': 25,
    'Fear': 15,
    'Disgust': 10
}

# 2. INITIALIZE CAMERA
cap = cv2.VideoCapture(0)
if not cap.isOpened():
    print("Error: Could not open camera.")
    exit(1)

print("Camera initialized. Press 'q' to quit.")

# 3. MAIN LOOP: Process each frame in real-time
while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break

    # Convert to grayscale for face detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # Detect faces in the current frame
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    # Process each detected face
    for (x, y, w, h) in faces:
        # Extract the face region
        face = gray[y:y+h, x:x+w]
        
        # Preprocess face for the model (resize, normalize, reshape)
        face_resized = cv2.resize(face, (48, 48))
        face_normalized = face_resized / 255.0
        face_reshaped = np.reshape(face_normalized, (1, 48, 48, 1))

        # Predict emotion
        prediction = model.predict(face_reshaped, verbose=0)
        emotion = emotions[np.argmax(prediction)]
        score = emotion_score[emotion]

        # Draw rectangle around face
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
        
        # Display emotion and score on the frame
        label = f"{emotion} - Score: {score}"
        cv2.putText(frame, label, (x, y-10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)
        
        # Also display score below the face
        cv2.putText(frame, f"Score: {score}", (x, y+h+30),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

    # Display the frame
    cv2.imshow("Patient Feed", frame)

    # Break loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 4. CLEANUP
cap.release()
cv2.destroyAllWindows()
print("Camera released. Goodbye!")
