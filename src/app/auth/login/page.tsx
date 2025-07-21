'use client';

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (res?.ok) {
      toast.success("Login successful!");
      router.push('/');
    } else {
      if (res?.error?.includes("No user found")) {
        setError("User not found. Please check your username.");
        toast.error("User not found");
      } else if (res?.error?.includes("Invalid password")) {
        setError("Invalid password. Please try again.");
        toast.error("Invalid password");
      } else {
        setError("Something went wrong. Try again.");
        toast.error("Login failed");
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back 👋</h2>
        <p className="text-center text-sm text-gray-500 mb-6">Please enter your credentials to login</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
