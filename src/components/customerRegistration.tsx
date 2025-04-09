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

const CustomerRegistration: React.FC = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordError, setPasswordError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (registerPassword !== confirmPassword) {
      setPasswordError("Password and Confirm Password do not match.");
      console.log("Passwords do not match"); // Debugging
      return;
    } else {
      setPasswordError("");
      console.log("Passwords match"); // Debugging
    }
    
    try {
      const response = await fetch("/api/middleware/v1/customers/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: registerEmail, password: registerPassword }),
      });
  
      if (!response.ok) throw new Error("Error registering customer");
  
      const result = await response.json();
      alert(result.message);
  
      // Reset form
      setRegisterEmail("");
      setConfirmPassword("");
      setRegisterPassword("");
    } catch (error) {
      console.error(error);
      alert("Failed to register customer");
    }
  };
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/middleware/v1/customers/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!response.ok) throw new Error("Invalid login credentials");

      const result = await response.json();
      alert(result.message);
      setLoginEmail("");
      setLoginPassword("");
    } catch (error) {
      console.error(error);
      alert("Login failed");
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
        Enter your email and password to create a new account.
      </CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
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
      <div className="grid gap-2">
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
      <Button type="submit">Login</Button>
    </CardFooter>
  </form>
</TabsContent>

        </Tabs>
      </Card>
    </div>
  );
};

export default CustomerRegistration;
