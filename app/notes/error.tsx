'use client';

interface ErrorProps {
  error: Error;
}

export default function Error({ error }: ErrorProps) {
  return (
    <p className="errorText">
      Could not fetch the list of notes. {error.message}
    </p>
  );
}
