import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GenericCombobox } from "@/components/mentor/combobox";

type Item = {
  id: number;
  label: string;
};

const items: Item[] = [
  { id: 1, label: "React" },
  { id: 2, label: "Next.js" },
  { id: 3, label: "TypeScript" },
];

describe("GenericCombobox", () => {
  it("shows placeholder when no value is selected", () => {
    render(
      <GenericCombobox<Item>
        items={items}
        value={null}
        onValueChange={jest.fn()}
        placeholder="Choose technology"
        itemToStringValue={(item) => item.label}
      />,
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger.textContent).toContain("Choose technology");
  });

  it("opens and displays all items when clicked", async () => {
    const user = userEvent.setup();

    render(
      <GenericCombobox<Item>
        items={items}
        value={null}
        onValueChange={jest.fn()}
        itemToStringValue={(item) => item.label}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).not.toBeNull();
    expect(screen.getByText("React")).not.toBeNull();
    expect(screen.getByText("Next.js")).not.toBeNull();
    expect(screen.getByText("TypeScript")).not.toBeNull();
  });

  it("filters items by search query", async () => {
    const user = userEvent.setup();

    render(
      <GenericCombobox<Item>
        items={items}
        value={null}
        onValueChange={jest.fn()}
        itemToStringValue={(item) => item.label}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    const searchInput = screen.getByPlaceholderText("Search...");
    await user.type(searchInput, "next");

    expect(screen.queryByText("React")).toBeNull();
    expect(screen.getByText("Next.js")).not.toBeNull();
    expect(screen.queryByText("TypeScript")).toBeNull();
  });

  it("calls onValueChange and closes after selecting an item", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    render(
      <GenericCombobox<Item>
        items={items}
        value={null}
        onValueChange={onValueChange}
        itemToStringValue={(item) => item.label}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("button", { name: "Next.js" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith(items[1]);
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("shows selected value label on trigger", () => {
    render(
      <GenericCombobox<Item>
        items={items}
        value={items[2]}
        onValueChange={jest.fn()}
        itemToStringValue={(item) => item.label}
      />,
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger.textContent).toContain("TypeScript");
  });

  it("closes when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <div>
        <GenericCombobox<Item>
          items={items}
          value={null}
          onValueChange={jest.fn()}
          itemToStringValue={(item) => item.label}
        />
        <button type="button">Outside</button>
      </div>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).not.toBeNull();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("renders custom item content via renderItem", async () => {
    const user = userEvent.setup();

    render(
      <GenericCombobox<Item>
        items={items}
        value={null}
        onValueChange={jest.fn()}
        itemToStringValue={(item) => item.label}
        renderItem={(item) => <span>{`Skill: ${item.label}`}</span>}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByText("Skill: React")).not.toBeNull();
    expect(screen.getByText("Skill: Next.js")).not.toBeNull();
    expect(screen.getByText("Skill: TypeScript")).not.toBeNull();
  });
});
