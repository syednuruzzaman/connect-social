// Mobile stub for ChatInterface component
interface ChatInterfaceProps {
  receiverId: string;
}

export default function ChatInterface({ receiverId }: ChatInterfaceProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-center">
      <p className="text-gray-500 text-sm">Chat functionality not available in mobile app</p>
    </div>
  );
}
