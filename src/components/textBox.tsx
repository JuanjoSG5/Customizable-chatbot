import SendIcon from "./icons/sendIcon";

const TextBox = ({ input, setInput, handleSend, isSetupComplete, loading }) => {
  return (
    <div className="flex gap-2 justify-center items-center">
      <input
        className="border rounded-full p-2 border-gray-700 w-full"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder={
          isSetupComplete ? "Type your message..." : "Setting up RAG..."
        }
        disabled={!isSetupComplete || loading}
      />
      <button onClick={handleSend} disabled={!isSetupComplete || loading}>
        {loading ? "..." : <SendIcon />}
      </button>
    </div>
  );
};

export default TextBox;