// "use client"

// import * as React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
// import Paper from '@mui/material/Paper';
// import { useRouter } from 'next/navigation';  
// import Button from '@mui/material/Button';
// import Box from '@mui/material/Box';
// import ScreenShare from '../../components/ScreenShare'
// import ScreenShareReceiver from '../../components/ScreenReceiver'

// // Define the columns for the DataGrid
// const columns = [
//   { field: 'id', headerName: 'ID', width: 70, flex: 1 },
//   { field: 'title', headerName: 'Title', width: 200, flex: 2 },
//   { field: 'body', headerName: 'Description', width: 250, flex: 3 },
//   { field: 'priority', headerName: 'Priority', width: 130, flex: 1 },
//   { field: 'category', headerName: 'Category', width: 150, flex: 1 },
//   { field: 'department', headerName: 'Department', width: 150, flex: 1 },
//   {
//     field: 'status',
//     headerName: 'Status',
//     width: 130,
//     flex: 1,
//     renderCell: (params) => {
//       let color;
//       switch (params.value) {
//         case 'Closed':
//           color = 'green';
//           break;
//         case 'Open':
//           color = 'red';
//           break;
//         case 'InProgress':
//           color = 'orange';
//           break;
//         default:
//           color = 'gray'; // Default color for unknown status
//       }
//       return (
//         <div style={{
//           color: color,
//           fontWeight: 'bold',
//           padding: '2px px',
//           borderRadius: '5px',
//           textAlign: 'center',
//         }}>
//           {params.value}
//         </div>
//       );
//     },
//   },
// ];

// // Client component to display the DataGrid
// const TicketList = ({ tickets, role }) => {
//   // console.log("tickets 577777777777777777>>>", tickets);

//   const router = useRouter();
//   console.log("role in list pafe", role);
//   const roleName = role ? role : ''
//   // Check if tickets is def  ined and is an array
//   const rows = Array.isArray(tickets) ? tickets.map(ticket => ({
//     id: ticket.id,
//     title: ticket.title,
//     body: ticket.body.slice(0, 200) + '...',
//     priority: ticket.priority,
//     category: ticket.category,
//     department: ticket.department,
//     status: ticket.status,
//     user_email:ticket.user_email
//   })) : []; // Default to an empty array if tickets is not valid

//   const columnsWithActions = [
//     ...columns, // Include all columns
//     ...(roleName === 'Admin' || roleName === 'IT Team' ? [ // Check if roleName is 'Admin' or 'IT Team'
//       {
//         field: 'user_email', // New column for user email
//         headerName: 'Created By',
//         width: 200,
//         flex: 1,
//         renderCell: (params) => (
//           <div style={{ textAlign: 'center' }}>
//             {params.row.user_email} {/* Display user email */}
//           </div>
//         ),
//       },
//       {
//         field: 'actions',
//         headerName: 'Actions',
//         width: 100,
//         renderCell: (params) => (
//           <Button
//             onClick={() => {
//               router.push(`/tickets/edit/${params.row.id}`); // Use the router variable
//             }}
//             variant="outlined"
//             size="small"
//           >
//             View
//           </Button>
//         ),
//       }
//     ] : []), // If not Admin or IT Team, do not include the actions column
//   ];

//   return (
//     <Paper sx={{ height: 400, width: '100%' }}>
//       <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginLeft: 3, marginRight: 3, marginTop: 2 }}>
//         <h2 style={{ marginTop: 5 }}>Tickets</h2>
//         <Button
//           className="btn-primary"
//           onClick={() => router.push('/tickets/create')}
//           sx={{ marginLeft: 'auto', marginTop: 2 }}
//         >
//           New Ticket
//         </Button>
//       </Box>
//       {/* {roleName === 'User' && (
//         <div>
//           <ScreenShare/>
//         </div>
//       )}
//       {roleName === 'IT Team' && (
//         <div>
//         <ScreenShareReceiver/>
//         </div>
//       )} */}
//       <div style={{margin: '0 25px'}}>
//         <DataGrid
//           rows={rows}
//           columns={columnsWithActions} // Use the updated columns
//           pageSizeOptions={[5, 10]}
//           checkboxSelection
//           sx={{ border: 0 }}
//         />
//       </div>  
//     </Paper>
//   );
// };

// export default TicketList;



"use client";

import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ScreenShare from "../../components/ScreenShare";
import ScreenShareReceiver from "../../components/ScreenReceiver";

// Define the columns for the DataGrid
const columns = [
  { field: "id", headerName: "ID", width: 70, flex: 1 },
  { field: "title", headerName: "Title", width: 200, flex: 2 },
  { field: "body", headerName: "Description", width: 250, flex: 3 },
  { field: "priority", headerName: "Priority", width: 130, flex: 1 },
  { field: "category", headerName: "Category", width: 150, flex: 1 },
  { field: "department", headerName: "Department", width: 150, flex: 1 },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    flex: 1,
    renderCell: (params) => {
      let color;
      switch (params.value) {
        case "Closed":
          color = "green";
          break;
        case "Open":
          color = "red";
          break;
        case "InProgress":
          color = "orange";
          break;
        default:
          color = "gray"; // Default color for unknown status
      }
      return (
        <div
          style={{
            color: color,
            fontWeight: "bold",
            padding: "2px px",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {params.value}
        </div>
      );
    },
  },
];

// Client component to display the DataGrid
const TicketList = ({ tickets, role }) => {
  // console.log("tickets 577777777777777777>>>", tickets);

  const router = useRouter();
  console.log("role in list pafe", role);
  const roleName = role ? role : "";
  // Check if tickets is def  ined and is an array
  const rows = Array.isArray(tickets)
    ? tickets.map((ticket) => ({
        id: ticket.id,
        title: ticket.title,
        body: ticket.body.slice(0, 200) + "...",
        priority: ticket.priority,
        category: ticket.category,
        department: ticket.department,
        status: ticket.status,
        user_email: ticket.user_email,
      }))
    : []; // Default to an empty array if tickets is not valid

  const columnsWithActions = [
    ...columns, // Include all columns
    ...(roleName === "Admin" || roleName === "IT Team" || roleName === "User"
      ? [
          // Check if roleName is 'Admin' or 'IT Team'
          {
            field: "user_email", // New column for user email
            headerName: "Created By",
            width: 200,
            flex: 1,
            renderCell: (params) => (
              <div style={{ textAlign: "center" }}>
                {params.row.user_email} {/* Display user email */}
              </div>
            ),
          },
          {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
              <Button
                onClick={() => {
                  router.push(
                    `/tickets/edit/${params.row.id}?roleName=${roleName}`
                  ); // Pass roleName as a query parameter
                }}
                variant="outlined"
                size="small"
              >
                View
              </Button>
            ),
          },
        ]
      : []), // If not Admin or IT Team, do not include the actions column
  ];

  return (
    <div>
      <Paper sx={{ height: "auto", width: "100%" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ marginLeft: 3, marginRight: 3, marginTop: 2 }}
        >
          <h2 style={{ marginTop: 5 }}>Tickets</h2>
          <Button
            className="btn-primary"
            onClick={() => router.push("/tickets/create")}
            sx={{ marginLeft: "auto", marginTop: 2 }}
          >
            New Ticket
          </Button>
        </Box>
        <div style={{ margin: "0 25px" }}>
          <DataGrid
            rows={rows}
            columns={columnsWithActions} // Use the updated columns
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </div>
      </Paper>
    </div>
  );
};

export default TicketList;