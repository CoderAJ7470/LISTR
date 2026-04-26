// validation functions for step 1 of form
export const validateListName = (name: string) => {
  return name.trim() !== '';
};

export const validateNumberOfItems = (value: string) => {
  const num = Number(value);

  if (!Number.isInteger(num)) return false;
  if (num < 1) return false;
  if (num > 40) return false;

  return true;
};
