// import CreateForm from "./CreateForm";
// import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// import { cookies } from "next/headers";

// const CreateTicket = async () => {

//   const supabase = createServerComponentClient({ cookies });
//   const { data: { user }, error } = await supabase.auth.getUser();
//   console.log("user>>>", user);
  
//   return (
//     <main>
//       <h2 className="text-primary text-center">Add a new ticket</h2>
//       <CreateForm users={user.id}/>
//     </main>
//   );
// };

// export default CreateTicket;


import CreateForm from "./CreateForm";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getUserDetails() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("useruseruser", user.id);

  if (error) {
    console.log(error.message);
    return null;
  }

  // Assuming the user has a role column in the users table
  const { data: roleData } = await supabase
    .from("role_mapping")
    .select("role_name")
    .eq("user_id", user.id)
    .single();
  console.log("roleData", roleData);
  return {
    id: user.id,
    role: roleData ? roleData.role_name : null,
  };
}

const CreateTicket = async () => {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  console.log("user>>>", user);

  const { id, role } = await getUserDetails();
  console.log("role===>>>", role);
  if (!role) {
    return <p className="text-center">Unable to retrieve user role</p>;
  }

  return (
    <main>
      <h2 className="text-primary text-center">Add a new ticket</h2>
      <CreateForm users={user.id} role={role}/>
    </main>
  );
};

export default CreateTicket;