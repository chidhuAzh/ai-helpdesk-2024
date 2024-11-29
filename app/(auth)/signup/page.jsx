"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const Signup = () => {
  const router = useRouter();

  const [formError, setFormError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e, email, password) => {
    e.preventDefault();

    const supabase = createClientComponentClient();

    const { error, user } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setFormError(error.message);
    }

    if (!error && user) {
      const { error: roleError } = await supabase.from("role_mapping").insert([
        {
          created_at: new Date().toISOString(),
          user_id: user.id,
          role_name: "User",
        },
      ]);

      if (roleError) {
        console.error("Error inserting role mapping:", roleError.message);
      }

      router.push("/verify");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-8">
      <div className="bg-white shadow-lg rounded-lg p-5 w-full max-w-md">
        <div className="flex justify-center mb-1">
          <Image
            src="/Teams-image.png"
            alt="Login Illustration"
            width={70}
            height={70}
          />
        </div>
        <h2 className="text-center">Sign up</h2>
        <form
          onSubmit={(e) => handleSubmit(e, email, password)}
          style={{ width: "100%" }}
        >
          <label className="block mb-4">
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </span>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <label className="block mb-6">
            <span className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </span>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>
          <div className="flex justify-between">
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200 mr-2"
            >
              Back to Login
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-200">
              Submit
            </button>
          </div>
        </form>
        {formError && <div className="error">{formError}</div>}
      </div>
    </div>
  );
};

export default Signup;