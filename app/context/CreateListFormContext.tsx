'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { databases } from '../../src/lib/appwrite';
import { DATABASE_ID, TABLE_ID } from '../../src/lib/constants';

type ListItem = {
  id: string;
  itemText: string;
};

type List = {
  id: string;
  listName: string;
  items: ListItem[];
};

interface CreateListFormContextType {
  listName: string;
  setListName: (name: string) => void;
  numberOfItems: number;
  setNumberOfItems: (num: number) => void;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  selectedListId: string | null;
  setSelectedListId: React.Dispatch<React.SetStateAction<string | null>>;
  isLoading: boolean;
  dirtyListIds: string[];
  markListDirty: (listId: string) => void;
  markListClean: (listId: string) => void;
  syncDirtyState: (updatedList: List) => void;
  compareLists: List[];
  setCompareLists: React.Dispatch<React.SetStateAction<List[]>>;
}

const CreateListFormContext = createContext<
  CreateListFormContextType | undefined
>(undefined);

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
  const [isLoading, setIsLoading] = useState(true);
  const [dirtyListIds, setDirtyListIds] = useState<string[]>([]);

  // baseline/pre-change state to compare any list against changes made by the user, so
  // that if the user makes one/more changes, then reverts back to the original
  // baseline, no actual changes were made and the "Save changes" button in the
  // ControlPanel will get disabled again.
  const [compareLists, setCompareLists] = useState<List[]>([]);

  const markListDirty = (listId: string) => {
    console.log('marked as dirty');
    setDirtyListIds((prev) =>
      prev.includes(listId) ? prev : [...prev, listId],
    );
  };

  const markListClean = (listId: string) => {
    console.log('marked as clean');
    setDirtyListIds((prev) => prev.filter((id) => id !== listId));
  };

  const syncDirtyState = (updatedList: List) => {
    const baseline = compareLists.find((l) => l.id === updatedList.id);

    if (!baseline) return;

    const isSame =
      JSON.stringify(updatedList.items) === JSON.stringify(baseline.items);

    if (isSame) {
      markListClean(updatedList.id);
    } else {
      markListDirty(updatedList.id);
    }
  };

  useEffect(() => {
    if (lists.length === 0) {
      setSelectedListId(null);
      return;
    }

    const exists = lists.some((list) => list.id === selectedListId);

    if (!selectedListId || !exists) {
      setSelectedListId(lists[0].id);
    }
  }, [lists, selectedListId]);

  const fetchLists = async () => {
    try {
      setIsLoading(true);
      const response = await databases.listDocuments(DATABASE_ID, TABLE_ID);

      const formattedList = response.documents.map((document) => ({
        id: document.$id,
        listName: document.listName,
        items: document.items ? JSON.parse(document.items) : [],
      }));

      setLists(formattedList);
      setCompareLists(formattedList);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

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
        isLoading,
        dirtyListIds,
        markListDirty,
        markListClean,
        compareLists,
        setCompareLists,
        syncDirtyState,
      }}
    >
      {children}
    </CreateListFormContext.Provider>
  );
};
