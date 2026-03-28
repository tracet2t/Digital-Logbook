"use client"

import React from "react";

export const Item: React.FC<{ size?: string; className?: string; children?: React.ReactNode }> = ({ children, className }) => (
  <div className={`flex flex-col ${className}`}>{children}</div>
);

export const ItemContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col">{children}</div>
);

export const ItemTitle: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className }) => (
  <span className={`font-medium ${className}`}>{children}</span>
);

export const ItemDescription: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <span className="text-sm text-gray-500">{children}</span>
);