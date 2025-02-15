const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoModel = require("./Models/todo.js");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({ origin: "*" })); // Allow all origins (for testing)
app.use(express.json());

const MONGO_URI = "mongodb+srv://Shyam_8870:Shyam%408870@cluster0.8kc0m.mongodb.net/todolist";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB is connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));


// MongoDB Connection URI

// Routes
app.get("/get", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/add", async (req, res) => {
  try {
    const { task } = req.body;
    if (!task) return res.status(400).json({ error: "Task is required" });

    const newTodo = await todoModel.create({ task });
    res.json(newTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { task } = req.body;

    if (!task) return res.status(400).json({ error: "Task is required" });

    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { task },
      { new: true } // Return updated document
    );

    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });

    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await todoModel.findByIdAndDelete(id);

    if (!deletedTodo) return res.status(404).json({ error: "Todo not found" });

    res.json({ message: "Deleted successfully", deletedTodo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
