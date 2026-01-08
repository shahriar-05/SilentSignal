import cv2
from ultralytics import YOLO
from deepface import DeepFace

emotion_score = {
    'happy': 80,
    'neutral': 50,
    'sad': 20,
    'angry': 25,
    'fear': 15,
    'disgust': 10,
    
}

model = YOLO("yolov8n-face.pt")
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, conf=0.5)

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            face = frame[y1:y2, x1:x2]

            try:
                analysis = DeepFace.analyze(
                    face,
                    actions=['emotion'],
                    enforce_detection=False
                )

                emotion = analysis[0]['dominant_emotion']
                score = emotion_score.get(emotion, 50)

                cv2.rectangle(frame, (x1,y1), (x2,y2), (0,255,0), 2)
                cv2.putText(frame, emotion, (x1, y1-10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255,0,0), 2)
                cv2.putText(frame, f"Score: {score}", (x1, y2+30),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,255), 2)

            except Exception as e:
                print("Emotion error:", e)

    cv2.imshow("YOLO Mood Detection", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
