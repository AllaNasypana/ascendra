'use client';

import { FiArrowLeft } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="text-muted-foreground transition-colors hover:text-foreground"
      aria-label="Go back"
    >
      <FiArrowLeft className="h-5 w-5" />
    </button>
  );
};
