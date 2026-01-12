import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './views/Dashboard';
import { MaterialCoding } from './views/MaterialCoding';
import { MaterialRules } from './views/MaterialRules';
import { FileRules } from './views/FileRules';
import { storageService } from './services/storage';

const SidebarLink: React.FC<{ to: string; label: string; icon: React.ReactNode }> = ({ to, label, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

const Header = () => (
  <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
    <div className="flex items-center space-x-4">
      <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        物料与文件编码智能管理系统
      </h1>
    </div>
    <div className="flex items-center space-x-6">
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        <span>系统运行正常</span>
      </div>
      <div className="flex items-center space-x-3 border-l pl-6 border-gray-100">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
          管
        </div>
        <span className="text-sm font-medium text-gray-700">管理员 (Admin)</span>
      </div>
    </div>
  </header>
);

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const success = storageService.checkSessionLock('Admin');
    setIsLocked(!success);
    return () => storageService.releaseLock();
  }, []);

  if (isLocked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">系统当前繁忙</h2>
          <p className="text-gray-600 mb-8">
            为了确保编码的唯一性与连续性，系统目前仅允许一个人员进行操作。
          </p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            重试连接
          </button>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex min-h-screen">
        <aside className="w-72 bg-white border-r border-gray-100 p-6 flex flex-col fixed h-full">
          <div className="mb-10 px-2 flex items-center">
            <svg width="180" height="50" viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(30, 30)">
                {[...Array(12)].map((_, i) => (
                  <path key={i} d="M0,-22 C3,-22 5,-18 5,-10 C5,-2 2,0 0,0 C-2,0 -5,-2 -5,-10 C-5,-18 -3,-22 0,-22" fill="#33C1D9" transform={`rotate(${i * 30}) translate(0, -5)`} />
                ))}
                <circle cx="0" cy="0" r="10" fill="white" />
              </g>
              <text x="70" y="42" fontFamily="sans-serif" fontSize="34" fontWeight="700" fill="#4B4B4B" letterSpacing="-1">vivolight</text>
            </svg>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarLink to="/" label="智能报表" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>} />
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">业务操作</div>
            <SidebarLink to="/material" label="物料编码发放" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>} />
            <SidebarLink to="/file" label="文件编码发放" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
            
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">规则查阅</div>
            <SidebarLink to="/material-rules" label="物料编码规则" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>} />
            <SidebarLink to="/file-rules" label="文件编码规则" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>} />
            
            <div className="pt-4 pb-2 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">设置</div>
            <SidebarLink to="/history" label="导出历史" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
          </nav>

          <div className="mt-auto p-4 bg-gray-50 rounded-2xl">
            <p className="text-xs text-gray-400 text-center font-medium">编码管理系统 V3.6<br/>符合 QI-08-006 规定</p>
          </div>
        </aside>

        <main className="flex-1 ml-72 min-h-screen flex flex-col">
          <Header />
          <div className="p-8 flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/material" element={<MaterialCoding />} />
              <Route path="/material-rules" element={<MaterialRules />} />
              <Route path="/file-rules" element={<FileRules />} />
              <Route path="/file" element={
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed">
                  <h3 className="text-lg font-bold text-gray-400">文件编码模块开发中...</h3>
                </div>
              } />
              <Route path="/history" element={
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed">
                  <h3 className="text-lg font-bold text-gray-400">历史导出功能正在对接云端...</h3>
                </div>
              } />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;