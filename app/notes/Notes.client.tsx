'use client';

import SearchBox from '@/components/SearchBox/SearchBox';
import css from './Notes.module.css';
import { fetchNotes } from '@/lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import Pagination from '@/components/Pagination/Pagination';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import Loader from '@/components/Loader/Loader';
import NoteList from '@/components/NoteList/NoteList';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

export default function NotesClient() {
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', query, currentPage],
    queryFn: () => fetchNotes(query, currentPage),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];

  const setQueryDebounce = useDebouncedCallback((query: string) => {
    setQuery(query);
    setCurrentPage(1);
  }, 1000);

  const closeModal = () => setIsOpenModal(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox query={query} setQuery={setQueryDebounce} />
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <button className={css.button} onClick={() => setIsOpenModal(true)}>
          Create note +
        </button>
      </header>
      {notes && notes.length > 0 && <NoteList notes={notes} />}
      {isError && <ErrorMessage />}
      {isLoading && <Loader />}
      {isOpenModal && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
