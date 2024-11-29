import Image from "next/image";
import Link from "next/link";
import Logo from "public/Teams-image.png";
import LogoutBtn from "./LogoutBtn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Divider from '@mui/material/Divider';


// const supabase = createServerComponentClient({ cookies });
// const { data: { user }, error } = await supabase.auth.getUser();

async function getUserDetails() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user }, error } = await supabase.auth.getUser();

  console.log("useruseruser", user?.id);

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

const Navbar = async ({ user }) => {
  const { id, role } = await getUserDetails();
  // console.log("555555555555656449 ------------>>>>>>>>>",role) 
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 15px 0px 15px' }}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
          <Image src={Logo} alt="Helpdesk logo" width={50} quality={100} placeholder="blur" />
          <h1 className="ml-3 text-lg font-bold">Aalam Helpdesk</h1>
          <div className="flex gap-6 ml-8">
            <Link href="/tickets" className="hover:text-gray-300">
              Tickets
            </Link>
            {role === "Admin" && (
              <Link href="/adminDashboard" className="hover:text-gray-300">
                Admin Dashboard
              </Link>
            )}
            {role === "User" && (
              <Link href="/userDashboard" className="hover:text-gray-300">
                User Dashboard
              </Link>
            )}
          </div>
        </div>

        <div style={{ height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%', transform: 'translateY(30%)' }}>
            {user && <span className="text-sm" style={{ marginRight: '10px' }}>Hello, {user.email}</span>}
            <LogoutBtn />
          </div>
        </div>
      </div>
      <Divider style={{ margin: '10px 0' }} />
    </>
    // <nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
    //   {/* Left side: Logo and Menus */}
    //   <div className="flex items-center">
    //     <Image src={Logo} alt="Helpdesk logo" width={70} quality={100} placeholder="blur" />
    //     <h1 className="ml-3 text-lg font-bold">Aalam Helpdesk</h1>
    //     <div className="flex gap-6 ml-8">
    //       <Link href="/tickets" className="hover:text-gray-300">
    //         Tickets
    //       </Link>
    //       {role === "Admin" && (
    //         <Link href="/adminDashboard" className="hover:text-gray-300">
    //           Admin Dashboard
    //         </Link>
    //       )}
    //       {role === "User" && (
    //         <Link href="/userDashboard" className="hover:text-gray-300">
    //           User Dashboard
    //         </Link>
    //       )}
    //     </div>
    //   </div>

    //   {/* Right side: User information and Logout button */}
    //   <div className="flex items-center gap-4">
    //     {user && <span className="text-sm">Hello, {user.email}</span>}
    //     <LogoutBtn />
    //   </div>
    // </nav>
  );
};

export default Navbar;  