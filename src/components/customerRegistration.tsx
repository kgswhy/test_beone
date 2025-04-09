"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone } from "lucide-react";



const CustomerRegistration: React.FC = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerName, setRegisterName] = useState('');
const [registerPhone, setRegisterPhone] = useState('');

  const [registerPassword, setRegisterPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (registerPassword !== confirmPassword) {
    setPasswordError("Password and Confirm Password do not match.");
    return;
  } else {
    setPasswordError("");
  }

  try {
    const response = await fetch("http://localhost:3000/api/middleware/v1/customers/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: registerEmail,
        password: registerPassword,
        confirmPassword: confirmPassword,
        name: registerName,
        phone: registerPhone
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Cek error unik dari API (duplicate email)
      if (result.message?.includes("already exists")) {
        toast.error("Email sudah terdaftar.");
      } else {
        toast.error("Registrasi gagal. Coba lagi.");
      }
      return;
    }

    toast.success(result.message || "Customer registered successfully!");

    // Reset form
    setRegisterName("");
    setRegisterPhone("");
    setRegisterEmail("");
    setRegisterPassword("");
    setConfirmPassword("");

  } catch (error) {
    console.error(error);
    toast.error("Failed to register customer. Please try again.");
  }
};

  
  
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/middleware/v1/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
  
      if (!response.ok) throw new Error("Invalid login credentials");
  
      const result = await response.json();
      toast.success(result.message)
  
      // Simpan token ke localStorage
      localStorage.setItem("customer_id", result.user.id);
      localStorage.setItem("token", result.token);
  
      setLoginEmail("");
      setLoginPassword("");
  
      // Redirect ke halaman utama (yang akan tampilkan dashboard)
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Login Failed")
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-sm">
        <Tabs defaultValue="register" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="login">Login</TabsTrigger>
            </TabsList>
          </CardHeader>

         <TabsContent value="register">
         <form onSubmit={handleRegister}>
  <CardHeader>
    <CardTitle>Register Customer</CardTitle>
    <CardDescription>
      Enter your name, email, and password to create a new account.
    </CardDescription>
  </CardHeader>
  <CardContent className="grid gap-4">
    
    {/* Nama */}
    <div className="grid gap-2">
      <Label htmlFor="registerName">Full Name</Label>
      <Input
        id="registerName"
        type="text"
        placeholder="Enter your full name"
        value={registerName}
        onChange={(e) => setRegisterName(e.target.value)}
        required
      />
    </div>

    {/* Nomor Telepon */}
    <div className="grid gap-2">
      <Label htmlFor="registerPhone">Phone Number</Label>
      <Input
        id="registerPhone"
        type="tel"
        placeholder="Enter your phone number"
        value={registerPhone}
        onChange={(e) => setRegisterPhone(e.target.value)}
        required
      />
    </div>

    {/* Email */}
    <div className="grid gap-2">
      <Label htmlFor="registerEmail">Email</Label>
      <Input
        id="registerEmail"
        type="email"
        placeholder="Enter your email"
        value={registerEmail}
        onChange={(e) => setRegisterEmail(e.target.value)}
        required
      />
    </div>

    {/* Password */}
    <div className="grid gap-2">
      <Label htmlFor="registerPassword">Password</Label>
      <Input
        id="registerPassword"
        type="password"
        placeholder="Enter a password"
        value={registerPassword}
        onChange={(e) => setRegisterPassword(e.target.value)}
        className={passwordError ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
    </div>

    {/* Confirm Password */}
    <div className="grid gap-2">
      <Label htmlFor="confirmPassword">Confirm Password</Label>
      <Input
        id="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={passwordError ? "border-red-500 focus-visible:ring-red-500" : ""}
        required
      />
      {passwordError && (
        <p className="text-sm text-red-500 mt-1">{passwordError}</p>
      )}
    </div>

  </CardContent>
  <CardFooter className="flex justify-end">
    <Button type="submit">Register</Button>
  </CardFooter>
</form>

</TabsContent>

<TabsContent value="login">
  <form onSubmit={handleLogin}>
    <CardHeader>
      <CardTitle>Login Customer</CardTitle>
      <CardDescription>
        Enter your email and password to log in to your account.
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="loginEmail">Email</Label>
        <Input
          id="loginEmail"
          type="email"
          placeholder="Enter your email"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="loginPassword">Password</Label>
        <Input
          id="loginPassword"
          type="password"
          placeholder="Enter your password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          required
        />
      </div>
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button type="submit" className="w-full mt-5">Login</Button>
    </CardFooter>
    <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
  </form>
</TabsContent>

        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerRegistration;
