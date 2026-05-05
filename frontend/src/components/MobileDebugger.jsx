import { useState, useEffect } from "react";

const MobileDebugger = () => {
  const [logs, setLogs] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show debug console in development or if explicitly enabled
    const isDev = import.meta.env.MODE === 'development';
    const debugEnabled = localStorage.getItem('enableDebug') === 'true';
    
    if (!isDev && !debugEnabled) return;

    // Only show on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Intercept console.log, console.error, console.warn
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (type, args) => {
      const timestamp = new Date().toLocaleTimeString();
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      setLogs(prev => [...prev.slice(-50), { type, message, timestamp }]);
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog('log', args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog('error', args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog('warn', args);
    };

    // Log initial info
    console.log("🔍 Mobile Debugger Active");
    console.log("User Agent:", navigator.userAgent);
    console.log("SessionStorage available:", typeof sessionStorage !== 'undefined');
    console.log("LocalStorage available:", typeof localStorage !== 'undefined');

    // Cleanup
    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  // Only render on mobile and if enabled
  const isDev = import.meta.env.MODE === 'development';
  const debugEnabled = localStorage.getItem('enableDebug') === 'true';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (!isMobile || (!isDev && !debugEnabled)) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-[9999] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium"
        style={{ touchAction: 'manipulation' }}
      >
        {isVisible ? '✕ Close' : '🐛 Debug'}
      </button>

      {/* Debug Panel */}
      {isVisible && (
        <div className="fixed inset-0 z-[9998] bg-black/90 overflow-auto p-4">
          <div className="max-w-full">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-black/95 py-2">
              <h2 className="text-white font-bold text-lg">Debug Console</h2>
              <button
                onClick={() => setLogs([])}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Clear
              </button>
            </div>

            {/* Storage Info */}
            <div className="bg-gray-800 p-3 rounded mb-4 text-xs">
              <div className="text-yellow-400 font-bold mb-2">Storage Status:</div>
              <div className="text-white space-y-1">
                <div>googleLoginRole (session): {sessionStorage.getItem('googleLoginRole') || 'null'}</div>
                <div>googleLoginRole (local): {localStorage.getItem('googleLoginRole') || 'null'}</div>
                <div>token: {localStorage.getItem('token') ? 'exists' : 'null'}</div>
              </div>
            </div>

            {/* Logs */}
            <div className="space-y-2">
              {logs.length === 0 ? (
                <div className="text-gray-400 text-sm">No logs yet...</div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs font-mono ${
                      log.type === 'error'
                        ? 'bg-red-900/50 text-red-200'
                        : log.type === 'warn'
                        ? 'bg-yellow-900/50 text-yellow-200'
                        : 'bg-gray-800 text-gray-200'
                    }`}
                  >
                    <div className="text-gray-400 text-[10px] mb-1">{log.timestamp}</div>
                    <div className="whitespace-pre-wrap break-all">{log.message}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileDebugger;
