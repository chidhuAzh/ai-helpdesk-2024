import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import Navbar from "../components/Navbar";

const DashboardLayout = async ({ children }) => {
  const supabase = createServerComponentClient({ cookies });
  const { data } = await supabase.auth.getSession();

  console.log("ssssssssssssssssssss", data);
  if (!data.session) {
    redirect("/login");
  }

  // Fetch role_name based on user.id
  const { data: roleData, error } = await supabase
    .from('role_mapping')
    .select('role_name')
    .eq('user_id', data.session.user.id)
    .single();

  if (error) {
    console.error("Error fetching role:", error);
    // Handle error appropriately
  }
  const role = roleData?.role_name ? roleData?.role_name: null
  console.log("User role:  ----------->", role);

  return (
    <>
      <Navbar roleName={role} user={data.session.user.email}/>
      {children}
    </>
  );
};

export default DashboardLayout;
