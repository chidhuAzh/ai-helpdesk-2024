// "use client";

// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import {
//   TextField,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Chip,
//   Grid,
// } from "@mui/material";
// import AIAssistant from "./AIAssistant";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
// const supabase = createClientComponentClient();

// export default function CreateForm({ users: propUsers }) {
//   const router = useRouter();
//   const created_by = propUsers ? propUsers : "";
//   const [title, setTitle] = useState("");
//   const [body, setBody] = useState("");
//   const [priority, setPriority] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [category, setCategory] = useState("");
//   const [attachments, setAttachments] = useState([]);
//   const [department, setDepartment] = useState("");
//   const [impact, setImpact] = useState("");
//   const [isAIChatOpen, setIsAIChatOpen] = useState(false);
//   const [users, setUsers] = useState([]);
//   const [asigned_to, setAssignedTo] = useState("");
//   const [status, setStatus] = useState("Open");
//   // console.log("users===> ", users);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Get current user's email from Supabase
//     const {
//       data: { user },
//     } = await supabase.auth.getUser();
//     const userEmail = user?.email;
//     console.log('form ->454444444444444444444',userEmail)

//     const description = await getOpenAIDescription(title, body);
//     console.log("Generated Description:", description);
//     const priority = description;

//     const newTicket = {
//       title,
//       body,
//       priority,
//       category,
//       attachments,
//       department,
//       impact,
//       created_by,
//       asigned_to,
//       status,
//       updated_at: new Date().toISOString(),
//       user_email:userEmail
//     };

//     const res = await fetch(`${location.origin}/api/tickets`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(newTicket),
//     });

//     const json = await res.json();

//     if (json.error) {
//       console.log(json.error.message);
//       console.log(json.error);
//     }

//     if (json.data) {
//       // Send email notification with sender's email
//       const emailRes = await fetch(`${location.origin}/api/send-email`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           subject: `New Ticket Created: ${title}`,
//           ticketDetails: {
//             title,
//             priority,
//             category,
//             department,
//             impact,
//             description: body,
//             senderEmail: userEmail, // Add sender's email
//           },
//         }),
//       });

//       if (!emailRes.ok) {
//         console.log("Failed to send email notification");
//       }

//       router.refresh();
//       router.push("/tickets");
//     }
//   };

//   const handleFileChange = (e) => {
//     setAttachments(Array.from(e.target.files));
//   };

//   const handleRemoveFile = (fileToRemove) => {
//     setAttachments(
//       attachments.filter((file) => file.name !== fileToRemove.name)
//     );
//   };

//   // New function to interact with OpenAI
//   async function getOpenAIDescription(title, body) {
//     try {
//       console.log("Calling OpenAI with:", { title, body }); // Log the input
//       const res = await fetch(`/api/openai`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ title, body }),
//       });

//       if (!res.ok) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//       }

//       const json = await res.json();
//       console.log("OpenAI response:", json); // Log the response
//       return json.description; // Assuming the response contains a 'description' field
//     } catch (error) {
//       console.error("Error fetching description from OpenAI:", error);
//       return "Error generating description"; // Fallback message
//     }
//   }

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="w-1/2">
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               {/* <InputLabel>Title</InputLabel> */}
//               <TextField
//                 label="Title"
//                 required
//                 variant="outlined"
//                 onChange={(e) => setTitle(e.target.value)}
//                 value={title}
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               {/* <InputLabel>Description</InputLabel> */}
//               <TextField
//                 label="Description" 
//                 required
//                 multiline
//                 onChange={(e) => setBody(e.target.value)}
//                 value={body}
//               />
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Priority</InputLabel>
//               <Select
//                 // label="Priority"
//                 onChange={(e) => setPriority(e.target.value)}
//                 value={priority}
//               >
//                 <MenuItem value="low">Low</MenuItem>
//                 <MenuItem value="medium">Medium</MenuItem>
//                 <MenuItem value="high">High</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Category</InputLabel>
//               <Select
//                 required
//                 // label="Category"
//                 onChange={(e) => setCategory(e.target.value)}
//                 value={category}
//               >
//                 <MenuItem value="bug">Bug</MenuItem>
//                 <MenuItem value="feature">Feature Request</MenuItem>
//                 <MenuItem value="support">Support</MenuItem>
//                 <MenuItem value="other">Other</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Attachments</InputLabel>
//               <TextField
//                 type="file"
//                 // label="Attachments"
//                 inputProps={{ multiple: true }}
//                 onChange={handleFileChange}
//                 variant="outlined"
//                 fullWidth
//                 margin="normal"
//               />
//               <div style={{ marginTop: "10px" }}>
//                 {attachments.map((file) => (
//                   <Chip
//                     key={file.name}
//                     label={file.name}
//                     onDelete={() => handleRemoveFile(file)}
//                     style={{ margin: "5px" }}
//                   />
//                 ))}
//               </div>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Impact</InputLabel>
//               <Select
//                 // label="Impact"
//                 required
//                 onChange={(e) => setImpact(e.target.value)}
//                 value={impact}
//               >
//                 <MenuItem value="single">Single User</MenuItem>
//                 <MenuItem value="multiple">Multiple Users</MenuItem>
//                 <MenuItem value="department">Department Wide</MenuItem>
//                 <MenuItem value="organization">Organization Wide</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Department</InputLabel>
//               <Select
//                 // label="Department"
//                 required
//                 onChange={(e) => setDepartment(e.target.value)}
//                 value={department}
//               >
//                 <MenuItem value="IT">IT</MenuItem>
//                 <MenuItem value="HR">HR</MenuItem>
//                 <MenuItem value="Finance">Finance</MenuItem>
//                 <MenuItem value="Support">Support</MenuItem>
//                 <MenuItem value="Other">Other</MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Assigned To</InputLabel>
//               <Select
//                 required
//                 // label="Assigned To"
//                 onChange={(e) => setAssignedTo(e.target.value)}
//                 value={asigned_to}
//               >
//                 <MenuItem value="1f101ad5-921c-4d40-b616-c5a9f0e0051a">
//                   karthikeyan.shanmugam@triventsys.com
//                 </MenuItem>
//                 <MenuItem value="c95d8c28-deb1-4709-9ff6-3bb8469b75c8">
//                   chidambaramalagu003@gmail.com
//                 </MenuItem>
//                 <MenuItem value="c22869f8-ae08-479d-a66a-d6f34a49bd13">
//                   tharane.tharan@aalamsoft.com
//                 </MenuItem>
//               </Select>
//             </FormControl>
//           </Grid>
//         </Grid> 
//         <Button className="btn-primary" type="submit" disabled={isLoading}>
//           {isLoading ? <span>Adding...</span> : <span>Add Ticket</span>}
//         </Button>
//       </form>

//       <button
//         onClick={() => setIsAIChatOpen(!isAIChatOpen)}
//         className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
//       >
//         {isAIChatOpen ? "Close AI Help" : "Ask AI Assistant"}
//       </button>

//       {isAIChatOpen && <AIAssistant />}
//     </>
//   );
// }



"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Grid,
} from "@mui/material";
import AIAssistant from "./AIAssistant";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient();

export default function CreateForm({ users: propUsers, role }) {
  // console.log("role in create page", role);
  const router = useRouter();
  const roleName = role ? role : "";
  const created_by = propUsers ? propUsers : "";
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [priority, setPriority] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [department, setDepartment] = useState("");
  const [impact, setImpact] = useState("");
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("Open");
  // console.log("users===> ", users);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Get current user's email from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userEmail = user?.email;
    console.log("form ->454444444444444444444", userEmail);

    const description = await getOpenAIDescription(title, body);
    console.log("Generated Description:", description);
    const priority = description;

    const newTicket = {
      title,
      body,
      priority,
      category,
      attachments,
      department,
      impact,
      created_by,
      status,
      updated_at: new Date().toISOString(),
      user_email: userEmail,
    };

    const res = await fetch(`${location.origin}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket),
    });

    const json = await res.json();

    if (json.error) {
      console.log(json.error.message);
      console.log(json.error);
    }

    if (json.data) {
      // Send email notification with sender's email
      const emailRes = await fetch(`${location.origin}/api/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: `New Ticket Created: ${title}`,
          ticketDetails: {
            title,
            priority,
            category,
            department,
            impact,
            description: body,
            senderEmail: userEmail, // Add sender's email
          },
        }),
      });

      if (!emailRes.ok) {
        console.log("Failed to send email notification");
      }

      router.refresh();
      router.push("/tickets");
    }
  };

  const handleFileChange = (e) => {
    setAttachments(Array.from(e.target.files));
  };

  const handleRemoveFile = (fileToRemove) => {
    setAttachments(
      attachments.filter((file) => file.name !== fileToRemove.name)
    );
  };

  // New function to interact with OpenAI
  async function getOpenAIDescription(title, body) {
    try {
      console.log("Calling OpenAI with:", { title, body }); // Log the input
      const res = await fetch(`/api/openai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      console.log("OpenAI response:", json); // Log the response
      return json.description; // Assuming the response contains a 'description' field
    } catch (error) {
      console.error("Error fetching description from OpenAI:", error);
      return "Error generating description"; // Fallback message
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-1/2">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              {/* <InputLabel>Title</InputLabel> */}
              <TextField
                label="Title"
                required
                variant="outlined"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              {/* <InputLabel>Description</InputLabel> */}
              <TextField
                label="Description"
                required
                multiline
                onChange={(e) => setBody(e.target.value)}
                value={body}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Priority</InputLabel>
              <Select
                // label="Priority"
                onChange={(e) => setPriority(e.target.value)}
                value={priority}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                required
                // label="Category"
                onChange={(e) => setCategory(e.target.value)}
                value={category}
              >
                <MenuItem value="bug">Bug</MenuItem>
                <MenuItem value="feature">Feature Request</MenuItem>
                <MenuItem value="support">Support</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Attachments</InputLabel>
              <TextField
                type="file"
                // label="Attachments"
                inputProps={{ multiple: true }}
                onChange={handleFileChange}
                variant="outlined"
                fullWidth
                margin="normal"
              />
              <div style={{ marginTop: "10px" }}>
                {attachments.map((file) => (
                  <Chip
                    key={file.name}
                    label={file.name}
                    onDelete={() => handleRemoveFile(file)}
                    style={{ margin: "5px" }}
                  />
                ))}
              </div>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Impact</InputLabel>
              <Select
                // label="Impact"
                required
                onChange={(e) => setImpact(e.target.value)}
                value={impact}
              >
                <MenuItem value="single">Single User</MenuItem>
                <MenuItem value="multiple">Multiple Users</MenuItem>
                <MenuItem value="department">Department Wide</MenuItem>
                <MenuItem value="organization">Organization Wide</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Department</InputLabel>
              <Select
                // label="Department"
                required
                onChange={(e) => setDepartment(e.target.value)}
                value={department}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Support">Support</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button className="btn-primary" type="submit" disabled={isLoading}>
          {isLoading ? <span>Adding...</span> : <span>Add Ticket</span>}
        </Button>
      </form>

      <button
        onClick={() => setIsAIChatOpen(!isAIChatOpen)}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg"
      >
        {isAIChatOpen ? "Close AI Help" : "Ask AI Assistant"}
      </button>

      {isAIChatOpen && <AIAssistant />}
    </>
  );
}
