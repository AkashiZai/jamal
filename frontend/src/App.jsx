import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import PosPage from './pages/PosPage';
import LoginPage, { DEMO_ACCOUNTS } from './pages/LoginPage';
import { Clock, ShieldAlert } from 'lucide-react';

export default function App() {
  // Default to POS page with pre-logged in Cashier account for instant preview
  const [currentPage, setCurrentPage] = useState('pos');
  const [currentUser, setCurrentUser] = useState(DEMO_ACCOUNTS[0]);
  
  // NFR-04: 15-minute session timeout simulation (900 seconds)
  const SESSION_TIMEOUT_SECONDS = 15 * 60;
  const [remainingSeconds, setRemainingSeconds] = useState(SESSION_TIMEOUT_SECONDS);
  const [showTimeoutAlert, setShowTimeoutAlert] = useState(false);

  // Reset session timer upon user activity
  const resetTimer = useCallback(() => {
    setRemainingSeconds(SESSION_TIMEOUT_SECONDS);
  }, [SESSION_TIMEOUT_SECONDS]);

  // Activity listeners for NFR-04
  useEffect(() => {
    if (!currentUser) return;

    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener('click', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [currentUser, resetTimer]);

  // Countdown effect
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // Timeout reached
          handleLogout('หมดเวลาเซสชัน 15 นาทีตามนโยบายความปลอดภัย (NFR-04 Session Timeout)');
          return SESSION_TIMEOUT_SECONDS;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const handleLogout = (reason) => {
    setCurrentUser(null);
    setCurrentPage('login');
    if (reason) {
      alert(reason);
    }
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    resetTimer();
    // Redirect role: Cashier & Admin go to POS
    setCurrentPage('pos');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans text-espresso-900">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={() => handleLogout()}
        onNavigate={(page) => setCurrentPage(page)}
        currentPage={currentPage}
      />

      {/* Security Session Timer Status Bar (NFR-04) */}
      {currentUser && (
        <div className="bg-espresso-800 text-white px-4 py-1.5 text-[11px] flex items-center justify-between border-b border-espresso-700 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <span className="text-warmgray-200">
              กำลังใช้งานในชื่อ: <strong className="text-white font-bold">{currentUser.name}</strong> ({currentUser.roleName})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-terracotta" />
            <span className="text-warmgray-200">
              Session Timeout: <strong className="font-mono text-terracotta font-extrabold text-xs">{formatTime(remainingSeconds)}</strong>
            </span>
            <button
              onClick={resetTimer}
              className="text-[10px] text-warmgray-300 hover:text-white underline ml-1"
              title="ต่อเวลาเซสชัน"
            >
              รีเซ็ตเวลา
            </button>
          </div>
        </div>
      )}

      {/* Main Pages */}
      <div className="flex-1 flex flex-col">
        {currentPage === 'login' ? (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        ) : (
          <PosPage
            currentUser={currentUser}
            onTimeoutWarning={() => setShowTimeoutAlert(true)}
          />
        )}
      </div>
    </div>
  );
}
