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
    dietType: "",
    workoutType: "",
    foodLog: ""
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
        "https://fintness-tracker-agent-server.onrender.com/api/agent/generate",
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

    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const lineHeight = 7;

    doc.setFontSize(16);
    doc.text("AI Gym Trainer - Personalized Plan", margin, margin);

    doc.setFontSize(11);

    const lines = doc.splitTextToSize(plan, 180);

    let y = 20;

    lines.forEach((line) => {
      if (y + lineHeight > pageHeight) {
        doc.addPage();
        y = margin;
      }

      doc.text(line, margin, y);
      y += lineHeight;
    });

    doc.save("gym-plan.pdf");
  };

  const renderPlan = () => {
    return plan.split("\n").map((line, index) => {

      if (line.startsWith("#")) {
        return (
          <h3 key={index} className="plan-heading">
            {line.replace("#", "").trim()}
          </h3>
        );
      }

      if (line.trim() === "") {
        return <br key={index} />;
      }

      return (
        <p key={index} className="plan-text">
          {line}
        </p>
      );
    });
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

        <select name="dietType" onChange={handleChange}>
          <option value="">Diet Preference</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Non-Vegetarian">Non-Vegetarian</option>
        </select>

        <select name="workoutType" onChange={handleChange}>
          <option value="">Workout Type</option>
          <option value="Weight Training">Weight Training</option>
          <option value="Yoga">Yoga</option>
        </select>

        <textarea
          name="foodLog"
          placeholder="Enter today's food (Example: 2 roti, rice, dal, egg)"
          onChange={handleChange}
        />

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
  >
    <h2>Your Personalized Plan</h2>

    <div className="plan-output">
      {plan}
    </div>

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