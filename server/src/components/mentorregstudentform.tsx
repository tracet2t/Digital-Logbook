"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Role } from "@prisma/client";

interface Project {
  id: string;
  name: string;
}

export default function RegisterUserModal({ close }: { close: () => void }) {
  const [type, setType] = useState<Role>(Role.student);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [projectId, setProjectId] = useState<string>(""); // selected project
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loading, setLoading] = useState(false);

  //  Validation for text-only fields
  const validateTextOnly = (value: string) => /^[a-zA-Z]+$/.test(value);

  //Fetch project
  useEffect(() => {
  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/project", { cache: "no-store" }); 
      if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      toast.error("Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  fetchProjects();
}, []);

  const handleRegister = async () => {
    if (!email || !firstName || !lastName) {
      toast.error("All fields are required!");
      return;
    }

    if (!validateTextOnly(firstName) || !validateTextOnly(lastName)) {
      toast.error("First Name and Last Name must contain only letters.");
      return;
    }

    if (!projectId) {
      toast.error("Please select a project!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName, role: type, projectId }),
      });

      const data = await res.json();
      console.log("Register response:", data);

      if (!res.ok) {
        toast.error(data.message ?? "Error registering user");
        return;
      }

      toast.success("Invitation sent successfully!");

      // Reset form
      setEmail("");
      setFirstName("");
      setLastName("");
      setProjectId("");
      setType(Role.student);

      close();
    } catch (err) {
      console.error(err);
      toast.error("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={close}>
      <DialogContent className="sm:max-w-[480px] bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Register Users
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="grid gap-5">

            {/* Role Selection */}
            <div className="grid gap-2">
              <Label>User Type</Label>
              <Select value={type} onValueChange={(val) => setType(val as Role)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Role.mentor}>Mentor</SelectItem>
                  <SelectItem value={Role.student}>Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                className="bg-white"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* First Name */}
            <div className="grid gap-2">
              <Label>First Name</Label>
              <Input
                className="bg-white"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label>Last Name</Label>
              <Input
                className="bg-white"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Project Selection */}
            <div className="grid gap-2">
              <Label>Project</Label>
              {loadingProjects ? (
                <div>Loading projects...</div>
              ) : (
                <Select value={projectId} onValueChange={(val) => setProjectId(val)}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((proj) => (
                      <SelectItem key={proj.id} value={proj.id}>
                        {proj.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={close} disabled={loading}>
              Close
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Sending..." : "Register"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}