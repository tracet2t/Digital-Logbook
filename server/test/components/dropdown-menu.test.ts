import fs from "node:fs";
import path from "node:path";

describe("DropdownMenu - source structure", () => {
  const filePath = path.resolve(
    __dirname,
    "../../src/components/dropdown-menu.tsx",
  );

  const source = fs.readFileSync(filePath, "utf8");

  test("declares client component", () => {
    expect(source).toContain('"use client";');
  });

  test("imports radix dropdown primitives and icons", () => {
    expect(source).toContain('import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";');
    expect(source).toContain('import { Check, ChevronRight, Circle } from "lucide-react";');
    expect(source).toContain('import { cn } from "@/lib/utils";');
  });

  test("maps base dropdown primitives", () => {
    expect(source).toContain("const DropdownMenu = DropdownMenuPrimitive.Root;");
    expect(source).toContain("const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;");
    expect(source).toContain("const DropdownMenuGroup = DropdownMenuPrimitive.Group;");
    expect(source).toContain("const DropdownMenuPortal = DropdownMenuPrimitive.Portal;");
    expect(source).toContain("const DropdownMenuSub = DropdownMenuPrimitive.Sub;");
    expect(source).toContain("const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;");
  });

  test("sub trigger supports inset and chevron icon", () => {
    expect(source).toContain("const DropdownMenuSubTrigger = React.forwardRef<");
    expect(source).toContain("inset?: boolean;");
    expect(source).toContain('inset && "pl-8"');
    expect(source).toContain('<ChevronRight className="ml-auto" />');
    expect(source).toContain("DropdownMenuPrimitive.SubTrigger.displayName");
  });

  test("sub content uses animated classes", () => {
    expect(source).toContain("const DropdownMenuSubContent = React.forwardRef<");
    expect(source).toContain("DropdownMenuPrimitive.SubContent");
    expect(source).toContain("shadow-lg");
    expect(source).toContain("data-[state=open]:animate-in");
    expect(source).toContain("data-[side=top]:slide-in-from-bottom-2");
  });

  test("content defaults sideOffset to 4 and renders in portal", () => {
    expect(source).toContain("const DropdownMenuContent = React.forwardRef<");
    expect(source).toContain("sideOffset = 4");
    expect(source).toContain("<DropdownMenuPrimitive.Portal>");
    expect(source).toContain("<DropdownMenuPrimitive.Content");
    expect(source).toContain("shadow-md");
  });

  test("item supports inset and disabled styling", () => {
    expect(source).toContain("const DropdownMenuItem = React.forwardRef<");
    expect(source).toContain("DropdownMenuPrimitive.Item");
    expect(source).toContain("data-[disabled]:pointer-events-none");
    expect(source).toContain("data-[disabled]:opacity-50");
    expect(source).toContain('inset && "pl-8"');
  });

  test("checkbox item renders indicator with check icon", () => {
    expect(source).toContain("const DropdownMenuCheckboxItem = React.forwardRef<");
    expect(source).toContain("DropdownMenuPrimitive.CheckboxItem");
    expect(source).toContain("checked={checked}");
    expect(source).toContain("<DropdownMenuPrimitive.ItemIndicator>");
    expect(source).toContain('<Check className="h-4 w-4" />');
  });

  test("radio item renders indicator with circle icon", () => {
    expect(source).toContain("const DropdownMenuRadioItem = React.forwardRef<");
    expect(source).toContain("DropdownMenuPrimitive.RadioItem");
    expect(source).toContain('<Circle className="h-2 w-2 fill-current" />');
    expect(source).toContain("DropdownMenuPrimitive.RadioItem.displayName");
  });

  test("label supports inset and bold text styling", () => {
    expect(source).toContain("const DropdownMenuLabel = React.forwardRef<");
    expect(source).toContain('"px-2 py-1.5 text-sm font-semibold"');
    expect(source).toContain("DropdownMenuPrimitive.Label.displayName");
  });

  test("separator uses muted horizontal rule styling", () => {
    expect(source).toContain("const DropdownMenuSeparator = React.forwardRef<");
    expect(source).toContain('cn("-mx-1 my-1 h-px bg-muted", className)');
    expect(source).toContain("DropdownMenuPrimitive.Separator.displayName");
  });

  test("shortcut uses span attributes and tracking styles", () => {
    expect(source).toContain("const DropdownMenuShortcut = ({");
    expect(source).toContain("React.HTMLAttributes<HTMLSpanElement>");
    expect(source).toContain('cn("ml-auto text-xs tracking-widest opacity-60", className)');
    expect(source).toContain('DropdownMenuShortcut.displayName = "DropdownMenuShortcut";');
  });

  test("exports all dropdown menu helpers", () => {
    expect(source).toContain("export {");
    expect(source).toContain("DropdownMenu,");
    expect(source).toContain("DropdownMenuTrigger,");
    expect(source).toContain("DropdownMenuContent,");
    expect(source).toContain("DropdownMenuItem,");
    expect(source).toContain("DropdownMenuCheckboxItem,");
    expect(source).toContain("DropdownMenuRadioItem,");
    expect(source).toContain("DropdownMenuLabel,");
    expect(source).toContain("DropdownMenuSeparator,");
    expect(source).toContain("DropdownMenuShortcut,");
    expect(source).toContain("DropdownMenuGroup,");
    expect(source).toContain("DropdownMenuPortal,");
    expect(source).toContain("DropdownMenuSub,");
    expect(source).toContain("DropdownMenuSubContent,");
    expect(source).toContain("DropdownMenuSubTrigger,");
    expect(source).toContain("DropdownMenuRadioGroup,");
  });
});
