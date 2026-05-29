const extractTaskName = (notes?: string | null) => {
  const firstLine = notes?.split(/\r?\n/)[0]?.trim();
  return firstLine && firstLine.length > 0 ? firstLine : "Untitled Task";
};

export { extractTaskName };
