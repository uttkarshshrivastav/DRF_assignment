import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const ws = new WebSocket(`ws://localhost:8000/ws/notifications/?token=${token}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [data, ...prev]);
    };

    return () => {
      ws.close();
    };
  }, [navigate]);

  return (
    <Layout>
      <div className="p-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Notifications</h2>
          <button onClick={() => navigate('/dashboard')} className="btn">
            Dashboard
          </button>
        </div>

        <div className="border p-4 space-y-2 min-h-64">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No new notifications.</p>
          ) : (
            notifications.map((notif, idx) => (
              <div key={idx} className="p-2 border-b last:border-b-0 text-sm">
                <div className="font-bold text-xs text-gray-400 uppercase">
                  {notif.title === 'task_deadline' ? 'Deadline' : 'Assignment'}
                </div>
                <p className="text-black">{notif.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}