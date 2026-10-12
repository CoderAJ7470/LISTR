import type { ReactNode } from 'react';
import { CreateListFormProvider } from './context/ListContext';
import NotificationsSlideout from '../src/components/NotificationsSlideout';
import { NotificationsSlideoutProvider } from './context/NotificationsSlideoutContext';

import '../src/styles/main.scss';
import '../src/styles/wrapper.scss';

import '@fortawesome/fontawesome-free/css/all.min.css';

export const metadata = {
  title: 'LISTR',
  description: 'Indexed list manager app',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <NotificationsSlideoutProvider>
        <CreateListFormProvider>
          <body>
            <div className='wrapper'>{children}</div>
            <NotificationsSlideout />
          </body>
        </CreateListFormProvider>
      </NotificationsSlideoutProvider>
    </html>
  );
}
