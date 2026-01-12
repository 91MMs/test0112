
import React from 'react';
import { storageService } from '../services/storage';

export const Dashboard: React.FC = () => {
  const materials = storageService.getMaterials();
  const files = storageService.getFiles();
  const logs = storageService.getLogs();

  const stats = [
    { label: '已发物料编码', count: materials.length, color: 'bg-blue-500' },
    { label: '已发文件编码', count: files.length, color: 'bg-indigo-500' },
    { label: '今日生成', count: materials.filter(m => m.createdAt.startsWith(new Date().toISOString().split('T')[0])).length, color: 'bg-green-500' },
    { label: '操作记录', count: logs.length, color: 'bg-amber-500' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
            最近发放记录
          </h3>
          <div className="space-y-4">
            {materials.slice(0, 5).map(m => (
              <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-mono font-bold text-blue-600">{m.code}</p>
                  <p className="text-sm text-gray-600">{m.name} - {m.specification}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</p>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">物料</span>
                </div>
              </div>
            ))}
            {materials.length === 0 && <p className="text-center text-gray-400 py-8">暂无数据</p>}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-amber-600 rounded-full mr-3"></span>
            系统动态
          </h3>
          <div className="space-y-4">
            {logs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-amber-400 shrink-0"></div>
                <div>
                  <p className="text-gray-900"><span className="font-semibold">{log.operator}</span> {log.action}: <span className="text-blue-600">{log.target}</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {logs.length === 0 && <p className="text-center text-gray-400 py-8">暂无操作记录</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
