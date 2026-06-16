import type { FC, ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description: ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, description }) => (
  <header className="page-header">
    <h1 className="page-title">{title}</h1>
    <p className="page-description">{description}</p>
  </header>
);
