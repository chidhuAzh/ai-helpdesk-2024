"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client
import { Chart } from "react-google-charts"; // Import Google Charts
import { Card, CardContent, Grid } from "@mui/material"; // Import MUI components

const supabaseUrl = "https://ppxqubzckpfavasxgrla.supabase.co"; // Your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweHF1Ynpja3BmYXZhc3hncmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODA5NjgsImV4cCI6MjA0Nzg1Njk2OH0.IaIWsx7btp-yrGYyCRcjkiQE4wzeJmZBC9DGKn9okug"; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey); // Create Supabase client

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    inProgress: 0,
    closed: 0,
    open: 0,
    departmentCounts: { IT: 0, HR: 0, Others: 0, Finance: 0, Support: 0 },
    priorityCounts: { low: 0, high: 0, medium: 0 },
  });
  const [priorityData, setPriorityData] = useState([]); // New state for priority data
  const [categoryData, setCategoryData] = useState([]); // New state for category data

  console.log("priorityData", priorityData);
  
  const chartData = [
    ["Status", "Count", { role: "style" }],
    ["Open", stats.open, "color: #3b82f6"],
    ["In Progress", stats.inProgress, "color: #fbbf24"],
    ["Closed", stats.closed, "color: #22c55e"],
  ];

  // Prepare data for the pie chart based on department counts
  const pieChartData = [
    ["Department", "Count"],
    ["IT", stats.departmentCounts.IT],
    ["HR", stats.departmentCounts.HR],
    ["Others", stats.departmentCounts.Others],
    ["Finance", stats.departmentCounts.Finance],
    ["Support", stats.departmentCounts.Support],
  ];

  const pieChartOptions = {
    title: "Department Ticket Distribution",
  };

  // Fetch ticket categories from Supabase
  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const { data, error } = await supabase
          .from("tickets")
          .select("category")
          .eq("is_delete", false);

        if (error) throw error;

        const categoryCounts = {};
        data.forEach((ticket) => {
          const category = ticket.category;
          if (categoryCounts[category] !== undefined) {
            categoryCounts[category]++;
          } else {
            categoryCounts[category] = 1;
          }
        });

        setCategoryData(Object.entries(categoryCounts));
      } catch (error) {
        console.error("Error fetching category stats:", error);
      }
    };

    fetchCategoryStats();
  }, []);

  // Prepare data for the category chart
  const categoryChartData = [
    ["Category", "Count"],
    ...categoryData,
  ];

  const categoryChartOptions = {
    title: "Ticket Category Distribution",
    pieHole: 0.4,
  };

  useEffect(() => {
    const fetchTicketStats = async () => {
      try {
        const { data, error } = await supabase
          .from("tickets")
          .select("*")
          .eq("is_delete", false);

        if (error) throw error;

        setStats((prevStats) => {
          const departmentCounts = {
            IT: 0,
            HR: 0,
            Others: 0,
            Finance: 0,
            Support: 0,
          };
          data.forEach((ticket) => {
            const status = ticket.status?.toLowerCase();
            const department = ticket.department;
            if (status === "inprogress") prevStats.inProgress++;
            if (status === "closed") prevStats.closed++;
            if (status === "open") prevStats.open++;
            if (departmentCounts[department] !== undefined)
              departmentCounts[department]++;
          });
          return { ...prevStats, departmentCounts };
        });
      } catch (error) {
        console.error("Error fetching ticket stats:", error);
      }
    };

    fetchTicketStats();
  }, []);

  useEffect(() => {
    const fetchPriorityStats = async () => {
      try {
        const { data, error } = await supabase
          .from("tickets")
          .select("priority")
          .eq("is_delete", false);

        if (error) throw error;

        const priorityCounts = { "low priority": 0, "high priority": 0, "medium priority": 0 };
        data.forEach((ticket) => {
          const priority = ticket.priority?.toLowerCase();
          if (priorityCounts[priority] !== undefined) priorityCounts[priority]++;
        });

        setPriorityData(Object.entries(priorityCounts));
      } catch (error) {
        console.error("Error fetching priority stats:", error);
      }
    };

    fetchPriorityStats();
  }, []);

  // Prepare data for the priority chart
  const priorityChartData = [
    ["Priority", "Count"],
    ...priorityData.map(([key, value]) => [key.charAt(0).toUpperCase() + key.slice(1), value]), // Capitalize first letter
  ];

  const priorityChartOptions = {
    title: "Priority Distribution",
    pieHole: 0.4, // This creates a donut chart
  };

  return (
    <div style={{ padding: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <h2>Ticket Status Overview</h2>
              <Chart
                chartType="ColumnChart"
                width="100%"
                height="400px"
                data={chartData}
                options={{
                  title: "Ticket Status Overview",
                  legend: { position: "none" },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <h2>Department Ticket Distribution</h2>
              <Chart
                chartType="PieChart"
                data={pieChartData}
                options={pieChartOptions}
                width={"100%"}
                height={"400px"}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <h2>Ticket Category Distribution</h2>
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={categoryChartData}
                options={categoryChartOptions}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <h2>Priority Distribution</h2>
              <Chart
                chartType="PieChart"
                width="100%"
                height="400px"
                data={priorityChartData}
                options={priorityChartOptions}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;