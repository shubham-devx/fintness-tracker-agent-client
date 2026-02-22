import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { motion } from "framer-motion";
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
        "https://fintness-tracker-agent-server.onrender.com/api/agent",
        form
      );

      setPlan(res.data.plan);
      setLoading(false);
    } catch (error) {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("AI Gym Trainer - Personalized Plan", 10, 15);
    doc.setFontSize(11);
    const splitText = doc.splitTextToSize(plan, 180);
    doc.text(splitText, 10, 25);
    doc.save("gym-plan.pdf");
  };

  return (
    <div className="container">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        💪 AI Gym Trainer
      </motion.h1>

      <motion.div
        className="card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <input type="number" name="age" placeholder="Age" onChange={handleChange} />
        <input type="number" name="weight" placeholder="Weight (kg)" onChange={handleChange} />
        <input type="number" name="height" placeholder="Height (cm)" onChange={handleChange} />

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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generatePlan}
        >
          {loading ? "Generating..." : "Generate Plan"}
        </motion.button>
      </motion.div>

      {plan && (
        <motion.div
          className="result"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Your Personalized Plan</h2>
          <pre>{plan}</pre>

          <motion.button
            className="download-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadPDF}
          >
            Download PDF
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default App;