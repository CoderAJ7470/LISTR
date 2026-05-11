'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type ListItem = {
  id: string;
  itemText: string;
};

type List = {
  id: string;
  listName: string;
  items: ListItem[];
};

interface CreateListFormContext {
  listName: string;
  setListName: (name: string) => void;
  numberOfItems: number;
  setNumberOfItems: (num: number) => void;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  selectedListId: string | null;
  setSelectedListId: React.Dispatch<React.SetStateAction<string | null>>;
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
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  return (
    <CreateListFormContext.Provider
      value={{
        listName,
        setListName,
        numberOfItems,
        setNumberOfItems,
        lists,
        setLists,
        selectedListId,
        setSelectedListId,
      }}
    >
      {children}
    </CreateListFormContext.Provider>
  );
};
