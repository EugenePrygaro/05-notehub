import css from './App.module.css';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { fetchNotes } from '../../services/noteService';
import type { Note } from '../../types/note';

import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import SearchBox from '../SearchBox/SearchBox';

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', currentPage, search],
    queryFn: () => fetchNotes(currentPage, 12, search),
    placeholderData: keepPreviousData,
  });

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setCurrentPage(1);
    },
    300,
  );

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox defaultValue={search} onChange={updateSearchQuery} />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={currentPage - 1}
            onPageChange={(page) => setCurrentPage(page + 1)}
          ></Pagination>
        )}
        <button className={css.button} onClick={() => setIsOpenModal(true)}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <p className={css.error}>Error fetching notes</p>}
      {data?.notes && data.notes.length > 0 ? (
        <NoteList notes={data.notes as Note[]} />
      ) : (
        <p className={css.noNotes}>No notes found</p>
      )}
      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <NoteForm onCancel={() => setIsOpenModal(false)} />
        </Modal>
      )}
    </div>
  );
}
