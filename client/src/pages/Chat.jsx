import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Chat() {
  const { requestId } = useParams();
  const { user } = useContext(AuthContext);

  const socketRef = useRef(null);
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // Load old messages
  useEffect(() => {
    api.get(`/requests/${requestId}/messages`).then((res) => {
      setMessages(res.data);
    });
  }, [requestId]);

  // WebSocket
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000?requestId=${requestId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => [...prev, msg]);
    };

    return () => ws.close();
  }, [requestId]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!text.trim()) return;

    socketRef.current.send(
      JSON.stringify({
        requestId,
        sender: user._id,
        text,
      })
    );

    setText("");
  };

  /* ================= HELPERS ================= */

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDateLabel = (date) => {
    const msgDate = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const sameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    if (sameDay(msgDate, today)) return "Today";
    if (sameDay(msgDate, yesterday)) return "Yesterday";

    return msgDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= RENDER ================= */

  let lastDateLabel = "";

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Chat</h2>
        <p className="text-sm text-gray-400">
          Only visible to requester & owner
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m, i) => {
          const isMe = m.sender?._id === user._id;
          const dateLabel = formatDateLabel(m.createdAt);
          const showDate = dateLabel !== lastDateLabel;
          lastDateLabel = dateLabel;

          return (
            <div key={i}>
              {/* Date Divider */}
              {showDate && (
                <div className="flex justify-center my-4">
                  <span className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                    {dateLabel}
                  </span>
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-700 text-white rounded-bl-none"
                  }`}
                >
                  {!isMe && (
                    <p className="text-xs text-gray-300 mb-1">
                      {m.sender?.name}
                    </p>
                  )}

                  <p>{m.text}</p>

                  <p className="text-[10px] text-gray-300 text-right mt-1">
                    {formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded bg-gray-700 text-white outline-none"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}