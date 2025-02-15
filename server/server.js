const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoModel = require("./Models/todo.js");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todolist")
    .then(() => console.log("MongoDB is connected"))
    .catch(err => console.error("MongoDB connection error:", err));

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
        const newTodo = await todoModel.create({ task });
        res.json(newTodo);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id, { done: true }, { new: true } 
        );
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

app.listen(3000, () => console.log("Server running on port 3000"));
