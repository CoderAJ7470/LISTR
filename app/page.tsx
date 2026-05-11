'use client';

import ControlPanel from '../src/components/ControlPanel';
import List from '../src/components/List';
import ListButtons from '../src/components/ListButtons';

import { useCreateListForm } from './context/CreateListFormContext';

export default function Page() {
  const { lists } = useCreateListForm();

  return (
    <>
      <ControlPanel />
      {lists.length !== 0 && <ListButtons />}
      <List />
    </>
  );
}
