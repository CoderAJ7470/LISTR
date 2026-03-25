'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface CreateListFormContext {
  listName: string;
  setListName: (name: string) => void;
  numberOfItems: number;
  setNumberOfItems: (num: number) => void;
}

const CreateListFormContext = createContext<CreateListFormContext | undefined>(
  undefined,
);

export const useCreateListForm = () => {
  const context = useContext(CreateListFormContext);

  if (!context) {
    throw new Error(
      'useCreateListForm must be used within the CreateListFormProvider',
    );
  }

  return context;
};

interface ProviderProps {
  children: ReactNode;
}

export const CreateListFormProvider = ({ children }: ProviderProps) => {
  const [listName, setListName] = useState('');
  const [numberOfItems, setNumberOfItems] = useState(0);

  return (
    <CreateListFormContext.Provider
      value={{ listName, setListName, numberOfItems, setNumberOfItems }}
    >
      {children}
    </CreateListFormContext.Provider>
  );
};
