from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

# ======================================================
# Step 1: Initialize Flask App + Enable CORS
# ======================================================
app = Flask(__name__)
CORS(app)  # ✅ allow requests from frontend (React, etc.)

# ======================================================
# Step 2: Load Trained Regression Model
# ======================================================
MODEL_PATH = "models/habitability_model.pkl"
model = joblib.load(MODEL_PATH)

# ======================================================
# Step 3: Define Features Order (same as training)
# ======================================================
FEATURES = [
    "mass_earth", 
    "radius_earth", 
    "period_days", 
    "semi_major_axis_au", 
    "temp_k", 
    "distance_ly", 
    "star_mass_solar", 
    "star_temp_k"
]

# ======================================================
# Step 4: Prediction Endpoint
# ======================================================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # ✅ Check for missing features
        missing = [f for f in FEATURES if f not in data]
        if missing:
            return jsonify({"error": f"Missing features: {missing}"}), 400

        # ✅ Prepare input vector
        input_data = []
        for f in FEATURES:
            try:
                val = float(data[f])
            except:
                val = 0.0
            input_data.append(val)

        input_array = np.array(input_data).reshape(1, -1)

        # ✅ Predict habitability score (0–100 %)
        score = model.predict(input_array)[0]
        score = max(0, min(100, score))  # clamp between 0–100

        # ✅ Label (based on score threshold)
        label = 1 if score >= 50 else 0
        prediction = "Potentially Habitable" if label == 1 else "Non-Habitable"

        # ✅ Response
        result = {
            "habitability_score": round(float(score), 2),   # % score
            "habitability_label": label,                    # 0/1
            "prediction": prediction                        # readable
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ======================================================
# Step 5: Run Flask App
# ======================================================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
