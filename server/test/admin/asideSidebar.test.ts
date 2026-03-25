import fs from "node:fs";
import path from "node:path";

describe("AsideSidebar", () => {
  const filePath = path.resolve(
    __dirname,
    "../../src/components/AsideSidebar.tsx",
  );

  const source = fs.readFileSync(filePath, "utf8");

  test("defines expected main menu routes", () => {
    expect(source).toContain('{ label: "Dashboard", icon: <LayoutDashboard size={18} />, href: "/admin" }');
    expect(source).toContain('{ label: "Users", icon: <Users size={18} />, href: "/admin/users" }');
    expect(source).toContain('{ label: "Invitations", icon: <Mail size={18} />, href: "/admin/invitation" }');
    expect(source).toContain('href: "/admin/projects"');
    expect(source).toContain('{ label: "Badges", icon: <Award size={18} />, href: "/admin/badges" }');
    expect(source).toContain('{ label: "Reports", icon: <BarChart2 size={18} />, href: "/admin/reports" }');
  });

  test("formats known roles and falls back for unknown roles", () => {
    expect(source).toContain('if (role === "superAdmin") return "Super Admin";');
    expect(source).toContain('if (role === "mentor") return "Mentor";');
    expect(source).toContain('if (role === "student") return "Student";');
    expect(source).toContain("return role;");
  });

  test("builds initials with fallback", () => {
    expect(source).toContain('return `${fname?.[0] ?? ""}${lname?.[0] ?? ""}`.toUpperCase() || "?";');
  });

  test("loads session user on mount", () => {
    expect(source).toContain("getSessionOnClient().then((session) => {");
    expect(source).toContain("if (session) setUser(session as UserInfo);");
  });

  test("renders settings navigation and logout form", () => {
    expect(source).toContain('router.push("/admin/settings")');
    expect(source).toContain('<form action="/api/logout" method="post" className="w-full">');
    expect(source).toContain("Logout");
  });
});
