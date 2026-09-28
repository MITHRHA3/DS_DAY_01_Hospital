import sys
from pathlib import Path
from typing import Optional, List, Dict, Any
import numpy as np
import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "hospital_waiting_model.pkl"
DATA_PATH = BASE_DIR / "hospital_patient_waiting_times_10000_cleaned.csv"

# Check file existence
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset file not found at {DATA_PATH}")

# Load model and dataset
print(f"[MediFlow AI] Loading model from: {MODEL_PATH}")
model = joblib.load(MODEL_PATH)

print(f"[MediFlow AI] Loading dataset from: {DATA_PATH}")
df = pd.read_csv(DATA_PATH)

app = FastAPI(
    title="MediFlow AI Backend API",
    description="Hospital Operations Intelligence & Patient Waiting Time Prediction System",
    version="1.0.0"
)

# CORS middleware for frontend React app (localhost:5173, 3000, 4173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    department: str = Field(..., example="Cardiology")
    doctor: str = Field(..., example="Dr. Rajesh")
    day: str = Field(..., example="Monday")
    appointment_type: str = Field(..., example="Regular")
    appointment_hour: int = Field(..., ge=9, le=17, example=10)
    appointment_minute: int = Field(..., ge=0, le=50, example=20)


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": model is not None,
        "dataset_loaded": df is not None,
        "total_records": len(df) if df is not None else 0
    }


@app.get("/api/summary")
def get_summary():
    total_patients = int(len(df))
    avg_total_waiting = float(round(df["Total_Waiting_Min"].mean(), 2))
    avg_registration_waiting = float(round(df["Registration_Waiting_Min"].mean(), 2))
    avg_doctor_waiting = float(round(df["Doctor_Waiting_Min"].mean(), 2))
    
    high_waiting_pct = float(round((df["High_Waiting"].sum() / total_patients) * 100, 2))

    # Average total waiting time by department
    dept_stats = df.groupby("Department")["Total_Waiting_Min"].mean().reset_index()
    dept_stats["avg_waiting"] = dept_stats["Total_Waiting_Min"].round(2)
    max_dept_val = dept_stats["avg_waiting"].max()
    
    avg_by_department = [
        {
            "department": str(row["Department"]),
            "avg_waiting": float(row["avg_waiting"]),
            "is_highest": bool(row["avg_waiting"] == max_dept_val)
        }
        for _, row in dept_stats.sort_values(by="avg_waiting", ascending=False).iterrows()
    ]

    # Registration vs Doctor waiting by department
    dept_breakdown = df.groupby("Department")[["Registration_Waiting_Min", "Doctor_Waiting_Min"]].mean().reset_index()
    dept_registration_vs_doctor = [
        {
            "department": str(row["Department"]),
            "registration_waiting": float(round(row["Registration_Waiting_Min"], 2)),
            "doctor_waiting": float(round(row["Doctor_Waiting_Min"], 2))
        }
        for _, row in dept_breakdown.iterrows()
    ]

    # Weekday vs Weekend average total wait
    weekday_avg = float(round(df[df["Day_Type"] == "Weekday"]["Total_Waiting_Min"].mean(), 2))
    weekend_avg = float(round(df[df["Day_Type"] == "Weekend"]["Total_Waiting_Min"].mean(), 2))
    diff_pct = float(round(((weekend_avg - weekday_avg) / weekday_avg) * 100, 2))

    return {
        "total_patients": total_patients,
        "avg_total_waiting": avg_total_waiting,
        "avg_registration_waiting": avg_registration_waiting,
        "avg_doctor_waiting": avg_doctor_waiting,
        "high_waiting_percentage": high_waiting_pct,
        "avg_by_department": avg_by_department,
        "dept_registration_vs_doctor": dept_registration_vs_doctor,
        "weekday_vs_weekend": {
            "weekday_avg": weekday_avg,
            "weekend_avg": weekend_avg,
            "diff_pct": diff_pct
        }
    }


@app.get("/api/insights")
def get_insights():
    insights = []

    # 1. Highest waiting department
    dept_avg = df.groupby("Department")["Total_Waiting_Min"].mean()
    top_dept = dept_avg.idxmax()
    top_dept_val = round(dept_avg.max(), 1)
    insights.append({
        "id": 1,
        "title": "Highest Waiting Department",
        "description": f"{top_dept} records the highest overall patient waiting time averaging {top_dept_val} minutes per visit.",
        "category": "Bottleneck",
        "metric": f"{top_dept_val} min",
        "impact": "High"
    })

    # 2. Registration bottleneck
    reg_avg = df.groupby("Department")["Registration_Waiting_Min"].mean()
    reg_dept = reg_avg.idxmax()
    reg_val = round(reg_avg.max(), 1)
    insights.append({
        "id": 2,
        "title": "Registration Bottleneck",
        "description": f"The intake process in {reg_dept} is the slowest, with registration delays averaging {reg_val} minutes.",
        "category": "Intake",
        "metric": f"{reg_val} min",
        "impact": "Medium"
    })

    # 3. Doctor consultation bottleneck
    doc_avg = df.groupby("Department")["Doctor_Waiting_Min"].mean()
    doc_dept = doc_avg.idxmax()
    doc_val = round(doc_avg.max(), 1)
    insights.append({
        "id": 3,
        "title": "Doctor Consultation Delay",
        "description": f"Post-registration consultation waiting time is highest in {doc_dept}, taking {doc_val} minutes on average.",
        "category": "Clinical",
        "metric": f"{doc_val} min",
        "impact": "High"
    })

    # 4. Peak appointment hour
    hour_avg = df.groupby("Appointment_Hour")["Total_Waiting_Min"].mean()
    peak_hour = hour_avg.idxmax()
    peak_hour_val = round(hour_avg.max(), 1)
    insights.append({
        "id": 4,
        "title": "Peak Congestion Hour",
        "description": f"Appointments scheduled around {peak_hour}:00 experience severe congestion, with delays peaking at {peak_hour_val} minutes.",
        "category": "Capacity",
        "metric": f"{peak_hour}:00",
        "impact": "High"
    })

    # 5. Appointment type impact
    type_avg = df.groupby("Appointment_Type")["Total_Waiting_Min"].mean()
    worst_type = type_avg.idxmax()
    worst_type_val = round(type_avg.max(), 1)
    insights.append({
        "id": 5,
        "title": "Appointment Type Impact",
        "description": f"{worst_type} patients suffer the highest waiting duration averaging {worst_type_val} minutes.",
        "category": "Scheduling",
        "metric": f"{worst_type_val} min",
        "impact": "Medium"
    })

    # 6. Weekday vs Weekend variance
    wkday_val = round(df[df["Day_Type"] == "Weekday"]["Total_Waiting_Min"].mean(), 1)
    wkend_val = round(df[df["Day_Type"] == "Weekend"]["Total_Waiting_Min"].mean(), 1)
    insights.append({
        "id": 6,
        "title": "Weekend vs Weekday Variance",
        "description": f"Weekend visits average {wkend_val} minutes compared to {wkday_val} minutes on weekdays.",
        "category": "Operations",
        "metric": f"{wkend_val} vs {wkday_val}",
        "impact": "Low"
    })

    # 7. Doctor wait ratio
    total_reg = df["Registration_Waiting_Min"].sum()
    total_doc = df["Doctor_Waiting_Min"].sum()
    doc_ratio = round((total_doc / (total_reg + total_doc)) * 100, 1)
    insights.append({
        "id": 7,
        "title": "Primary Driver of Waiting Time",
        "description": f"Doctor consultation waiting accounts for {doc_ratio}% of total patient waiting time across all departments.",
        "category": "Analysis",
        "metric": f"{doc_ratio}%",
        "impact": "High"
    })

    return insights


@app.get("/api/departments")
def get_departments():
    grouped = df.groupby("Department")
    dept_list = []

    for dept_name, group in grouped:
        doctors = sorted(group["Doctor"].unique().tolist())
        dept_list.append({
            "department": str(dept_name),
            "patients": int(len(group)),
            "avg_registration_wait": float(round(group["Registration_Waiting_Min"].mean(), 2)),
            "avg_doctor_wait": float(round(group["Doctor_Waiting_Min"].mean(), 2)),
            "avg_total_wait": float(round(group["Total_Waiting_Min"].mean(), 2)),
            "median_wait": float(round(group["Total_Waiting_Min"].median(), 2)),
            "high_waiting_pct": float(round((group["High_Waiting"].sum() / len(group)) * 100, 2)),
            "doctors_count": int(len(doctors)),
            "doctors": doctors
        })

    # Default sort by avg_total_wait descending
    dept_list.sort(key=lambda x: x["avg_total_wait"], reverse=True)
    return dept_list


@app.get("/api/scheduling")
def get_scheduling():
    # Volume by Hour
    vol_df = df.groupby("Appointment_Hour").size().reset_index(name="patients")
    volume_by_hour = [
        {
            "hour": f"{int(row['Appointment_Hour']):02d}:00",
            "hour_num": int(row['Appointment_Hour']),
            "patients": int(row["patients"])
        }
        for _, row in vol_df.sort_values(by="Appointment_Hour").iterrows()
    ]

    # Waiting Time by Hour
    wait_df = df.groupby("Appointment_Hour")["Total_Waiting_Min"].mean().reset_index()
    waiting_by_hour = [
        {
            "hour": f"{int(row['Appointment_Hour']):02d}:00",
            "hour_num": int(row['Appointment_Hour']),
            "avg_waiting": float(round(row["Total_Waiting_Min"], 2))
        }
        for _, row in wait_df.sort_values(by="Appointment_Hour").iterrows()
    ]

    # Appointment Type vs Waiting Time
    type_df = df.groupby("Appointment_Type").agg(
        avg_waiting=("Total_Waiting_Min", "mean"),
        patient_count=("Patient_ID", "count")
    ).reset_index()
    waiting_by_type = [
        {
            "appointment_type": str(row["Appointment_Type"]),
            "avg_waiting": float(round(row["avg_waiting"], 2)),
            "patient_count": int(row["patient_count"])
        }
        for _, row in type_df.sort_values(by="avg_waiting", ascending=False).iterrows()
    ]

    # Peak Congestion Period
    peak_row = wait_df.loc[wait_df["Total_Waiting_Min"].idxmax()]
    peak_hour_int = int(peak_row["Appointment_Hour"])
    peak_patients = int(df[df["Appointment_Hour"] == peak_hour_int].shape[0])

    peak_congestion = {
        "peak_hour": f"{peak_hour_int:02d}:00",
        "peak_avg_wait": float(round(peak_row["Total_Waiting_Min"], 2)),
        "patients_count": peak_patients
    }

    return {
        "volume_by_hour": volume_by_hour,
        "waiting_by_hour": waiting_by_hour,
        "waiting_by_type": waiting_by_type,
        "peak_congestion": peak_congestion
    }


@app.get("/api/waiting-analytics")
def get_waiting_analytics(
    department: Optional[str] = Query(None),
    doctor: Optional[str] = Query(None),
    appointment_type: Optional[str] = Query(None),
    day: Optional[str] = Query(None),
    day_type: Optional[str] = Query(None)
):
    filtered_df = df.copy()

    if department and department != "All":
        filtered_df = filtered_df[filtered_df["Department"] == department]
    if doctor and doctor != "All":
        filtered_df = filtered_df[filtered_df["Doctor"] == doctor]
    if appointment_type and appointment_type != "All":
        filtered_df = filtered_df[filtered_df["Appointment_Type"] == appointment_type]
    if day and day != "All":
        filtered_df = filtered_df[filtered_df["Day"] == day]
    if day_type and day_type != "All":
        filtered_df = filtered_df[filtered_df["Day_Type"] == day_type]

    # Filter options for UI select inputs
    filter_options = {
        "departments": ["All"] + sorted(df["Department"].dropna().unique().tolist()),
        "doctors": ["All"] + sorted(df["Doctor"].dropna().unique().tolist()),
        "appointment_types": ["All"] + sorted(df["Appointment_Type"].dropna().unique().tolist()),
        "days": ["All"] + ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "day_types": ["All", "Weekday", "Weekend"]
    }

    if filtered_df.empty:
        return {
            "filtered_count": 0,
            "distribution": [],
            "dept_waiting": [],
            "registration_vs_doctor": [],
            "hour_vs_waiting": [],
            "filter_options": filter_options
        }

    # Histogram Bins (Total Waiting Time Distribution)
    bins = [0, 15, 30, 45, 60, 75, 90, 120, 180, 300]
    labels = ["0-15m", "15-30m", "30-45m", "45-60m", "60-75m", "75-90m", "90-120m", "120-180m", "180m+"]
    filtered_df["wait_bin"] = pd.cut(filtered_df["Total_Waiting_Min"], bins=bins, labels=labels, right=False)
    dist_series = filtered_df["wait_bin"].value_counts().sort_index()
    
    distribution = [
        {"bin": str(b), "count": int(c)}
        for b, c in dist_series.items()
    ]

    # Department Waiting Time
    dept_df = filtered_df.groupby("Department")["Total_Waiting_Min"].mean().reset_index()
    dept_waiting = [
        {
            "department": str(row["Department"]),
            "avg_waiting": float(round(row["Total_Waiting_Min"], 2))
        }
        for _, row in dept_df.sort_values(by="Total_Waiting_Min", ascending=False).iterrows()
    ]

    # Registration vs Doctor Stacked
    rvd_df = filtered_df.groupby("Department")[["Registration_Waiting_Min", "Doctor_Waiting_Min"]].mean().reset_index()
    registration_vs_doctor = [
        {
            "department": str(row["Department"]),
            "registration_waiting": float(round(row["Registration_Waiting_Min"], 2)),
            "doctor_waiting": float(round(row["Doctor_Waiting_Min"], 2))
        }
        for _, row in rvd_df.iterrows()
    ]

    # Hour vs Waiting Line Chart
    hour_df = filtered_df.groupby("Appointment_Hour").agg(
        avg_waiting=("Total_Waiting_Min", "mean"),
        patient_count=("Patient_ID", "count")
    ).reset_index()

    peak_h_val = hour_df["avg_waiting"].max() if not hour_df.empty else 0
    hour_vs_waiting = [
        {
            "hour": f"{int(row['Appointment_Hour']):02d}:00",
            "avg_waiting": float(round(row["avg_waiting"], 2)),
            "patient_count": int(row["patient_count"]),
            "is_peak": bool(row["avg_waiting"] == peak_h_val)
        }
        for _, row in hour_df.sort_values(by="Appointment_Hour").iterrows()
    ]

    return {
        "filtered_count": int(len(filtered_df)),
        "distribution": distribution,
        "dept_waiting": dept_waiting,
        "registration_vs_doctor": registration_vs_doctor,
        "hour_vs_waiting": hour_vs_waiting,
        "filter_options": filter_options
    }


@app.get("/api/model-performance")
def get_model_performance():
    X = df[['Department', 'Doctor', 'Day', 'Appointment_Type', 'Appointment_Hour', 'Appointment_Minute', 'Day_Type']]
    y = df['High_Waiting']

    y_pred = model.predict(X)

    acc = float(round(accuracy_score(y, y_pred) * 100, 2))
    prec = float(round(precision_score(y, y_pred) * 100, 2))
    rec = float(round(recall_score(y, y_pred) * 100, 2))
    f1 = float(round(f1_score(y, y_pred) * 100, 2))

    cm = confusion_matrix(y, y_pred).tolist()

    # Extract Feature Importances from model pipeline
    preprocessor = model.named_steps['preprocessor']
    feature_names = preprocessor.get_feature_names_out()
    importances = model.named_steps['classifier'].feature_importances_

    # Format feature names nicely
    feature_map = {}
    for fn, imp in zip(feature_names, importances):
        clean_name = fn.replace('numeric__', '').replace('categorical__', '')
        clean_name = clean_name.replace('_', ' ')
        feature_map[clean_name] = feature_map.get(clean_name, 0.0) + float(imp)

    sorted_features = sorted(feature_map.items(), key=lambda x: x[1], reverse=True)[:10]
    
    feature_importance = [
        {
            "feature": name,
            "importance": float(round(weight * 100, 2))
        }
        for name, weight in sorted_features
    ]

    return {
        "accuracy": acc,
        "precision": prec,
        "recall": rec,
        "f1_score": f1,
        "confusion_matrix": cm,
        "feature_importance": feature_importance
    }


@app.post("/api/predict")
def predict_waiting_risk(payload: PredictionRequest):
    try:
        # Determine day type automatically
        day_clean = payload.day.strip().capitalize()
        day_type = "Weekend" if day_clean in ["Saturday", "Sunday"] else "Weekday"

        input_df = pd.DataFrame([{
            "Department": payload.department,
            "Doctor": payload.doctor,
            "Day": day_clean,
            "Appointment_Type": payload.appointment_type,
            "Appointment_Hour": payload.appointment_hour,
            "Appointment_Minute": payload.appointment_minute,
            "Day_Type": day_type
        }])

        pred_class = int(model.predict(input_df)[0])
        probas = model.predict_proba(input_df)[0]
        
        confidence = float(round(probas[pred_class] * 100, 2))
        normal_prob = float(round(probas[0] * 100, 2))
        high_prob = float(round(probas[1] * 100, 2))

        if pred_class == 1:
            label = "HIGH WAITING TIME"
            recommendation = "High waiting time predicted. Consider reallocating staff or doctor capacity during this appointment period."
        else:
            label = "NORMAL WAITING TIME"
            recommendation = "Current appointment conditions show a lower predicted waiting-time risk. Normal patient flow expected."

        return {
            "prediction": label,
            "prediction_class": pred_class,
            "confidence": confidence,
            "probabilities": {
                "normal": normal_prob,
                "high": high_prob
            },
            "day_type": day_type,
            "recommendation": recommendation
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
