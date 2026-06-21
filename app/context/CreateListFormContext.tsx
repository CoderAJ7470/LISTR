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
  editedListIds: string[];
  markListEdited: (listId: string) => void;
  markListUnedited: (listId: string) => void;
  syncEditedState: (updatedList: List) => void;
  compareLists: List[];
  setCompareLists: React.Dispatch<React.SetStateAction<List[]>>;
  saveEditedLists: () => Promise<void>;
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
  const [editedListIds, setEditedListIds] = useState<string[]>([]);

  // baseline/pre-change state to compare any list against changes made by the user, so
  // that if the user makes one/more changes, then reverts back to the original
  // baseline, no actual changes were made and the "Save changes" button in the
  // ControlPanel will get disabled again.
  const [compareLists, setCompareLists] = useState<List[]>([]);

  const markListEdited = (listId: string) => {
    console.log('marked as edited');
    setEditedListIds((prev) =>
      prev.includes(listId) ? prev : [...prev, listId],
    );
  };

  const markListUnedited = (listId: string) => {
    console.log('marked as unedited');
    setEditedListIds((prev) => prev.filter((id) => id !== listId));
  };

  const syncEditedState = (updatedList: List) => {
    const baseline = compareLists.find((l) => l.id === updatedList.id);

    if (!baseline) return;

    const isSame =
      JSON.stringify(updatedList.items) === JSON.stringify(baseline.items);

    if (isSame) {
      markListUnedited(updatedList.id);
    } else {
      markListEdited(updatedList.id);
    }
  };

  /**
   * Saves any edited lists to the Appwrite DB.
   */
  const saveEditedLists = async () => {
    const editedLists = lists.filter((list) => editedListIds.includes(list.id));

    console.log('edited lists', editedLists);
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
        editedListIds,
        markListEdited,
        markListUnedited,
        compareLists,
        setCompareLists,
        syncEditedState,
        saveEditedLists,
      }}
    >
      {children}
    </CreateListFormContext.Provider>
  );
};
