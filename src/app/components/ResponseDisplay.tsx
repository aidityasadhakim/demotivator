type ResponseDisplayProps = {
  response: string | null;
};

const ResponseDisplay = ({ response }: ResponseDisplayProps) => {
  if (!response) return null;

  return (
    <div className="w-full max-w-lg lg:max-w-full mx-auto px-4 mb-8">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative">
        <div className="absolute -top-3 left-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            AI Response
          </span>
        </div>

        <div className="mt-4 prose dark:prose-invert max-w-none">
          {response.split("\n").map((paragraph, index) => (
            <p 
              key={index} 
              className={`text-gray-800 dark:text-gray-200 ${paragraph.trim() === "" ? "my-4" : ""}`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 dark:text-pink-400 bg-purple-100 dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-pink-500 transition-colors"
            aria-label="Share this demotivation"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponseDisplay;
