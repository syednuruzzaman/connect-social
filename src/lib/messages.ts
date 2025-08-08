import en from '../messages/en.json';

const messagesMap: Record<string, any> = {
  en,
};

export function getMessages(locale: string) {
  return messagesMap[locale] || messagesMap.en;
}
