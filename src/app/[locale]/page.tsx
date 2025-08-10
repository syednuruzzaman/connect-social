import { redirect } from 'next/navigation';

export default function LocalePage() {
  // Redirect to the main page since internationalization was removed
  redirect('/');
}
