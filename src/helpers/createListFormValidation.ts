// validation functions for step 1 of form
export const validateListName = (name: string) => {
  return name.trim() !== '';
};

export const validateNumberOfItems = (value: string) => {
  const num = Number(value);
  return value.trim() !== '' && !isNaN(num) && Number.isInteger(num) && num > 0;
};
