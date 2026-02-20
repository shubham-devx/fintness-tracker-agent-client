import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    age: "",
    weight: "",
    height: "",
    goal: "",
    experience: "",
  });

  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      setPlan("");

      const res = await axios.post(
        "http://localhost:5000/api/agent/generate",
        form
      );

      setPlan(res.data.plan);
      setLoading(false);
    } catch (error) {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>💪 AI Gym Trainer</h1>

      <div className="card">
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          onChange={handleChange}
        />

        <select name="goal" onChange={handleChange}>
          <option value="">Select Goal</option>
          <option value="Fat Loss">Fat Loss</option>
          <option value="Muscle Gain">Muscle Gain</option>
          <option value="Maintenance">Maintenance</option>
        </select>

        <select name="experience" onChange={handleChange}>
          <option value="">Experience Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button onClick={generatePlan}>
          {loading ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      {plan && (
        <div className="result">
          <h2>Your Personalized Plan</h2>
          <pre>{plan}</pre>
        </div>
      )}
    </div>
  );
}

export default App;