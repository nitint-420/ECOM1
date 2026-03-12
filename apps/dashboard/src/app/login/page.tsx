"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardContent } from "@ecom/ui";
import { Store, Phone, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) { toast.error("Enter valid 10-digit phone"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      toast.success("Welcome " + data.user.name + "!");
      router.push("/dashboard"); router.refresh();
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl mb-4 shadow-lg">
              <Store className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Grocery Store</h1>
            <p className="text-gray-500 mt-1">Sign in to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Phone" type="tel" placeholder="10-digit phone" icon={<Phone className="h-4 w-4" />} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} required />
            <div className="relative">
              <Input label="Password" type={showPw ? "text" : "password"} placeholder="Password" icon={<Lock className="h-4 w-4" />} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" className="w-full h-12 text-base" loading={loading}>Sign In</Button>
          </form>
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100 text-center">
            <p className="text-sm font-medium mb-1">Demo Credentials</p>
            <p className="text-sm text-gray-600">Phone: 9999999999 | Password: admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
