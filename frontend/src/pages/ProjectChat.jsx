import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProjectChat() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${projectId}/?token=${token}`);
    setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    return () => {
      ws.close();
    };
  }, [projectId, navigate]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ content: inputMessage }));
      setInputMessage('');
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => navigate('/dashboard')} className="btn">
          Dashboard
        </button>
        <h2 className="text-xl font-bold">Chat</h2>
        <button onClick={() => { logout(); navigate('/login'); }} className="btn">
          Log Out
        </button>
      </div>

      <div className="border h-96 overflow-y-auto p-4 mb-4 space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="block text-sm">
            <span className="font-bold mr-2">{msg.username}:</span>
            <span>{msg.content}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Message..."
          className="input input-bordered flex-1"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </div>
  );
}