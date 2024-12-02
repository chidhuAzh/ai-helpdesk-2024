import Image from "next/image";
import Link from "next/link";
import Logo from "public/Teams-image.png";
import LogoutBtn from "./LogoutBtn";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Divider from '@mui/material/Divider';
import ScreenShare from '../components/ScreenShare';


// const supabase = createServerComponentClient({ cookies });
// const { data: { user }, error } = await supabase.auth.getUser();

// async function getUserDetails() {
//   const supabase = createServerComponentClient({ cookies });
//   const { data: { user }, error } = await supabase.auth.getUser();

//   console.log("useruseruser", user?.id);

//   if (error) {
//     console.log(error.message);
//     return null;
//   }

//   // Assuming the user has a role column in the users table
//   const { data: roleData } = await supabase
//     .from("role_mapping")
//     .select("role_name")
//     .eq("user_id", user.id)
//     .single();
//   console.log("roleData", roleData);
//   return {
//     id: user.id,
//     role: roleData ? roleData.role_name : null,
//   };
// }

const Navbar = async ({ roleName, user }) => {
  console.log("user in props 465465", roleName);
  console.log("user in propsuser  465465", user);
  const role = 'User'

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
            {roleName === "Admin" && (
              <Link href="/adminDashboard" className="hover:text-gray-300">
                Admin Dashboard
              </Link>
            )}
            {roleName === "User" && (
              <Link href="/userDashboard" className="hover:text-gray-300">
                User Dashboard
              </Link>
            )}
            {roleName === 'User' && (
                <Link href="/screenShare" className="hover:text-gray-300" >
                Share Screen
                </Link>
            )}
            {roleName === 'IT Team' && (
                <Link href="/itTeamDashboard" className="hover:text-gray-300" >
                IT Dashboard
                </Link>
            )}
             {roleName === 'IT Team' && (
                <Link href="/screenReceiver" className="hover:text-gray-300" >
                  View Screen
                </Link>
            )}
          </div>
        </div>

        <div style={{ height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', height: '100%', transform: 'translateY(30%)' }}>
            {user && <span className="text-sm" style={{ marginRight: '10px' }}>Hello, {user}</span>}
            <LogoutBtn />
          </div>
        </div>
      </div>
      <Divider style={{ margin: '10px 0' }} />
    </>
  );
};

export default Navbar;  