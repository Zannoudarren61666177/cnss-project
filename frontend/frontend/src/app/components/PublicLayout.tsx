import type { ReactNode } from 'react';
import { Chatbot } from './Chatbot';

interface PublicLayoutProps {
  children: ReactNode;
  showChatbot?: boolean;
}

export function PublicLayout({ children, showChatbot = true }: PublicLayoutProps) {
  return (
    <>
      {children}
      {showChatbot && <Chatbot />}
    </>
  );
}
