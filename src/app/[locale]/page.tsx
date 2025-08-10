export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Connect Social</h1>
        <p className="text-gray-600 mb-6">
          Social media platform deployed successfully! 🎉
        </p>
        <a 
          href="/social" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Access Full App →
        </a>
      </div>
    </div>
  );
}
