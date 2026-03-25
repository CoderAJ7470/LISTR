// /app/layout.tsx
import '../src/styles/main.scss';
import '../src/styles/wrapper.scss';
import type { ReactNode } from 'react';

import '@fortawesome/fontawesome-free/css/all.min.css';

export const metadata = {
  title: 'LISTR',
  description: 'Indexed list manager app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <div className='wrapper'>{children}</div>
      </body>
    </html>
  );
}
