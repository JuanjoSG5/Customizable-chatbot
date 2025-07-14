const Chat = ({ messages, loading }) => {
  return (
    <div className="flex flex-col space-y-4 h-96 overflow-y-auto p-4 rounded-lg">
        {messages
          .filter((msg) => msg.role !== "system")
          .map((msg, idx) => (
            <div 
              key={idx}
              className={`p-3 rounded-lg max-w-xs text- ${
                msg.role === "user" 
                  ? "bg-blue-500 text-white self-end" 
                  : "bg-gray-200 text-black self-start"
              }`}
            >
              {msg.content}
            </div>
          ))}
        {loading && (
          <div className="bg-gray-200 text-black self-start p-3 rounded-lg max-w-xs">
            Thinking...
          </div>
        )}
      </div>
  );
};

export default Chat;