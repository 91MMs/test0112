import React from 'react';

export const FileRules: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
          <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          文件编码规则库
        </h2>
        <p className="text-sm text-gray-500">规范公司体系文件、技术文档的命名逻辑</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></span>
            三阶文件 (QI) 编码示例
          </h3>
          <div className="p-6 bg-indigo-50 rounded-xl font-mono text-lg text-indigo-700 text-center border border-indigo-100">
            QI - 08 - 006
          </div>
          <ul className="mt-6 space-y-3 text-sm text-gray-600">
            <li className="flex justify-between"><span>第一部分 (QI):</span> <span className="font-bold">质量手册/体系标识</span></li>
            <li className="flex justify-between"><span>第二部分 (08):</span> <span className="font-bold">职能部门/业务域</span></li>
            <li className="flex justify-between"><span>第三部分 (006):</span> <span className="font-bold">顺序流水号</span></li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-1.5 h-4 bg-green-500 rounded-full mr-2"></span>
            版本控制规则
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-black bg-gray-800 text-white px-2 py-1 rounded">V1.0</span>
              <span className="text-sm text-gray-600">初始正式发布版本</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-black bg-gray-800 text-white px-2 py-1 rounded">V1.1</span>
              <span className="text-sm text-gray-600">微调修改版本 (不涉及重大变更)</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-xs font-black bg-gray-800 text-white px-2 py-1 rounded">V2.0</span>
              <span className="text-sm text-gray-600">重大修订版本</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};