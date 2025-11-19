import React from "react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import { Container, Typography, Paper, Box, Button } from "@mui/material";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF0"];

function VisualizationPage({ notes, userBalance, onBack }) {
  const expenseData = notes
    .filter(n => n.type === "expense")
    .map(n => ({ name: n.title, value: n.amount }));

  const totalNotes = notes.filter(n => n.type === "note").length;
  const totalExpenses = expenseData.length;
  const totalSpent = expenseData.reduce((acc, n) => acc + n.value, 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={onBack} sx={{ mb: 2 }}>Back</Button>

      <Typography variant="h4" sx={{ mb: 3 }}>Data Visualization</Typography>

      <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Expenses Breakdown</Typography>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={expenseData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {expenseData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        <Paper sx={{ flex: 1, minWidth: 300, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Summary</Typography>
          <Typography>Total Notes: <b>{totalNotes}</b></Typography>
          <Typography>Total Expenses: <b>{totalExpenses}</b></Typography>
          <Typography>Total Spent: <b>₱{totalSpent.toFixed(2)}</b></Typography>
          <Typography>Current Balance: <b>₱{userBalance?.toFixed(2)}</b></Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default VisualizationPage;
