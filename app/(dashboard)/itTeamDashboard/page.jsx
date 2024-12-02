"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js"; // Import Supabase client
import { Chart } from "react-google-charts"; // Import Google Charts
import { Card, CardContent, Grid } from "@mui/material"; // Import MUI components

const supabaseUrl = "https://ppxqubzckpfavasxgrla.supabase.co"; // Your Supabase URL
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBweHF1Ynpja3BmYXZhc3hncmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIyODA5NjgsImV4cCI6MjA0Nzg1Njk2OH0.IaIWsx7btp-yrGYyCRcjkiQE4wzeJmZBC9DGKn9okug"; // Replace with your Supabase key
const supabase = createClient(supabaseUrl, supabaseKey); // Create Supabase client

const ITTeamDashboard = () => {
  const [stats, setStats] = useState({
    inProgress: 0,
    closed: 0,
    open: 0,
    departmentCounts: { IT: 0, HR: 0, Others: 0, Finance: 0, Support: 0 },
  });

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

  return (
    <div style={{ padding: "20px" }}>
      <div className="flex justify-around items-center p-4">
        {/* Open Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500 w-full md:w-1/4 transition-transform transform hover:scale-105 mx-2 my-2">
          <h3 className="text-gray-500 text-sm">Open Tickets</h3>
          <p className="text-3xl font-bold">{stats.open}</p>
        </div>

        {/* In Progress Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500 w-full md:w-1/4 transition-transform transform hover:scale-105 mx-2 my-2">
          <h3 className="text-gray-500 text-sm">In Progress</h3>
          <p className="text-3xl font-bold">{stats.inProgress}</p>
        </div>

        {/* Completed Tickets Card */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500 w-full md:w-1/4 transition-transform transform hover:scale-105 mx-2 my-2">
          <h3 className="text-gray-500 text-sm">Completed</h3>
          <p className="text-3xl font-bold">{stats.closed}</p>
        </div>
      </div>
      {/* <div className="flex justify-between mt-4 flex-wrap">
        {Object.entries(stats.departmentCounts).map(([department, count]) => (
          <div
            key={department}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-gray-500 w-full md:w-1/4 transition-transform transform hover:scale-105 mx-2 my-2"
          >
            <h3 className="text-gray-500 text-sm">{department} Tickets</h3>
            <p className="text-3xl font-bold">{count}</p>
          </div>
        ))}
      </div> */}
      {/* Render your dashboard components here */}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <h2 style={{ textAlign: "center" }}>Ticket Status Overview</h2>
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
              <h2 style={{ textAlign: "center" }}>Department Ticket Distribution</h2>
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
        {/* ... existing code for other cards ... */}
      </Grid>
    </div>
  );
};

export default ITTeamDashboard;