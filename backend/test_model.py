import sys
from pathlib import Path
import joblib

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "hospital_waiting_model.pkl"

print(f"Loading model from: {MODEL_PATH}")
try:
    model = joblib.load(MODEL_PATH)
    print("[SUCCESS] Model loaded successfully!")
    print(f"Model Type: {type(model)}")
    print(f"Model Steps: {[name for name, _ in model.steps]}")
    print(f"Classes: {model.classes_}")
except Exception as e:
    print(f"[ERROR] Failed to load model: {e}")
