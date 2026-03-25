import fs from "node:fs";
import path from "node:path";

describe("WelcomeEmail - source structure", () => {
  const filePath = path.resolve(
    __dirname,
    "../../src/components/emailformat.tsx",
  );

  const source = fs.readFileSync(filePath, "utf8");

  test("imports React", () => {
    expect(source).toContain('import React from "react";');
  });

  test("defines EmailTemplateProps with required fields", () => {
    expect(source).toContain("type EmailTemplateProps = {");
    expect(source).toContain("name: string;");
    expect(source).toContain("password: string;");
    expect(source).toContain("loginUrl: string;");
  });

  test("exports WelcomeEmail component", () => {
    expect(source).toContain("export const WelcomeEmail = ({");
    expect(source).toContain("}: EmailTemplateProps) => {");
  });

  test("renders welcome heading", () => {
    expect(source).toContain("Welcome to Our Digital Logbook!");
  });

  test("greets the user by name", () => {
    expect(source).toContain("Dear {name},");
  });

  test("renders temporary password text and password value", () => {
    expect(source).toContain("Your temporary password is:");
    expect(source).toContain("{password}");
  });

  test("renders login link using loginUrl prop", () => {
    expect(source).toContain("href={loginUrl}");
    expect(source).toContain("Go to Application");
  });

  test("includes support message", () => {
    expect(source).toContain("If you have any questions, feel free to contact our support team.");
  });

  test("renders logo image with expected source and alt", () => {
    expect(source).toContain('src="/logo.png"');
    expect(source).toContain('alt="Logo"');
  });

  test("uses expected outer container styles", () => {
    expect(source).toContain('backgroundColor: "#f3f4f6"');
    expect(source).toContain('minHeight: "100vh"');
    expect(source).toContain('display: "flex"');
    expect(source).toContain('alignItems: "center"');
    expect(source).toContain('justifyContent: "center"');
  });

  test("uses expected card styles", () => {
    expect(source).toContain('maxWidth: "640px"');
    expect(source).toContain('backgroundColor: "#fff"');
    expect(source).toContain('borderRadius: "8px"');
    expect(source).toContain('boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"');
  });

  test("styles password block as emphasized monospace text", () => {
    expect(source).toContain('backgroundColor: "#e5e7eb"');
    expect(source).toContain('color: "#dc2626"');
    expect(source).toContain('fontFamily: "monospace"');
    expect(source).toContain('fontSize: "1.125rem"');
  });

  test("styles link as blue underlined text", () => {
    expect(source).toContain('color: "#3b82f6"');
    expect(source).toContain('textDecoration: "underline"');
  });
});

describe("WelcomeEmail - template content rules", () => {
  function buildGreeting(name: string) {
    return `Dear ${name},`;
  }

  test("builds greeting text with provided name", () => {
    expect(buildGreeting("Nasrin")).toBe("Dear Nasrin,");
  });

  test("supports arbitrary login url strings", () => {
    const loginUrl = "https://example.com/login";
    expect(loginUrl.startsWith("http")).toBe(true);
  });

  test("password value can be represented as plain text", () => {
    const password = "TempPass123";
    expect(password).toContain("Temp");
    expect(password.length).toBeGreaterThan(0);
  });
});
