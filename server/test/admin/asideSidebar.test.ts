import fs from "node:fs";
import path from "node:path";

describe("AsideSidebar", () => {
  const filePath = path.resolve(
    __dirname,
    "../../src/components/AsideSidebar.tsx",
  );

  const source = fs.readFileSync(filePath, "utf8");

  test("defines MenuItem and LogoConfig interfaces", () => {
    expect(source).toContain("export interface MenuItem");
    expect(source).toContain("export interface LogoConfig");
    expect(source).toContain("label: string;");
    expect(source).toContain("icon: ReactNode;");
    expect(source).toContain("href: string;");
  });

  test("builds logo header with collapsed/expanded states", () => {
    expect(source).toContain("function LogoHeader");
    expect(source).toContain("collapsed");
    expect(source).toContain(
      "logoSrc = collapsed ? logo.collapsed : logo.expanded",
    );
    expect(source).toContain("SidebarHeader");
  });

  test("renders NavMenu with menu items from props", () => {
    expect(source).toContain("function NavMenu");
    expect(source).toContain("pathname");
    expect(source).toContain("onNavigate");
    expect(source).toContain("menu.map");
  });

  test("loads session user on mount", () => {
    expect(source).toContain("getSessionOnClient().then((s) => {");
    expect(source).toContain("if (s) setUser(s as UserInfo);");
  });

  test("calls navigate on router.push and closes mobile sidebar", () => {
    expect(source).toContain("router.push(href);");
    expect(source).toContain("setOpenMobile(false);");
  });
});
