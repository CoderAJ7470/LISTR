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
  completed: boolean;
};

type List = {
  id: string;
  listName: string;
  items: ListItem[];
};

interface ListContextType {
  listName: string;
  setListName: (name: string) => void;
  numberOfItems: number;
  setNumberOfItems: (num: number) => void;
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  selectedListId: string | null;
  setSelectedListId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedItemIds: string[];
  setSelectedItemIds: React.Dispatch<React.SetStateAction<string[]>>;
  isLoading: boolean;
  editedListIds: string[];
  markListEdited: (listId: string) => void;
  markListUnedited: (listId: string) => void;
  syncEditedState: (updatedList: List) => void;
  compareLists: List[];
  setCompareLists: React.Dispatch<React.SetStateAction<List[]>>;
  saveEditedLists: () => Promise<void>;
  saveItemsMarkedAsComplete: (
    listId: string,
    itemId: string,
    completed: boolean,
  ) => Promise<void>;
}

const ListContext = createContext<ListContextType | undefined>(undefined);

export const useList = () => {
  const context = useContext(ListContext);

  if (!context) {
    throw new Error('useList must be used within the ListProvider');
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
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editedListIds, setEditedListIds] = useState<string[]>([]);

  // baseline/pre-change state to compare any list against changes made by the user, so
  // that if the user makes one/more changes, then reverts back to the original
  // baseline, no actual changes were made and the "Save changes" button in the
  // ControlPanel will get disabled again.
  const [compareLists, setCompareLists] = useState<List[]>([]);

  const markListEdited = (listId: string) => {
    setEditedListIds((prev) =>
      prev.includes(listId) ? prev : [...prev, listId],
    );
  };

  const markListUnedited = (listId: string) => {
    setEditedListIds((prev) => prev.filter((id) => id !== listId));
  };

  const syncEditedState = (updatedList: List) => {
    const baseline = compareLists.find(
      (originalList) => originalList.id === updatedList.id,
    );

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
    try {
      for (const listId of editedListIds) {
        const list = lists.find((listItem) => listItem.id === listId);

        if (!list) continue;

        await databases.updateDocument(DATABASE_ID, TABLE_ID, list.id, {
          listName: list.listName,
          items: JSON.stringify(list.items),
        });
      }

      setCompareLists(
        lists.map((list) => ({
          ...list,
          items: [...list.items],
        })),
      );

      setEditedListIds([]);
    } catch (error) {
      console.error('Failed to save edited lists:', error);
    }
  };

  const saveItemsMarkedAsComplete = async (
    listId: string,
    itemId: string,
    completed: boolean,
  ) => {
    const list = lists.find((list) => list.id === listId);

    if (!list) return;

    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, completed } : item,
    );

    await databases.updateDocument(DATABASE_ID, TABLE_ID, listId, {
      items: JSON.stringify(updatedItems),
    });
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

      const formattedList = response.documents.map((document) => {
        const parsedItems = document.items ? JSON.parse(document.items) : [];

        console.log('Items from Appwrite:', parsedItems);

        return {
          id: document.$id,
          listName: document.listName,
          items: parsedItems.map((item: ListItem) => ({
            ...item,
            completed: item.completed ?? false,
          })),
        };
      });

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
    <ListContext.Provider
      value={{
        listName,
        setListName,
        numberOfItems,
        setNumberOfItems,
        lists,
        setLists,
        selectedListId,
        setSelectedListId,
        selectedItemIds,
        setSelectedItemIds,
        isLoading,
        editedListIds,
        markListEdited,
        markListUnedited,
        compareLists,
        setCompareLists,
        syncEditedState,
        saveEditedLists,
        saveItemsMarkedAsComplete,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};
