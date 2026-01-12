
import React from 'react';

const MATERIAL_TYPE_RULES = [
  { code: '1', name: '成品' },
  { code: '2', name: '半成品' },
  { code: '3', name: '电子类' },
  { code: '4', name: '机械类' },
  { code: '5', name: '塑胶类' },
  { code: '6', name: '光学类' },
  { code: '7', name: '包材类' },
  { code: '8', name: '辅料耗材类' },
  { code: '9', name: '管材工具类' }
];

export const MaterialRules: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">物料编码规则 (QI-08-006)</h2>
        <p className="text-gray-500 italic">"规则是质量的保证，编码是数据的灵魂"</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold mb-6 flex items-center text-blue-700">
          <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
          物料类型代码 (L1)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {MATERIAL_TYPE_RULES.map(rule => (
            <div key={rule.code} className="p-4 bg-gray-50 rounded-xl flex items-center justify-between border border-transparent hover:border-blue-200 transition-all">
              <span className="font-medium text-gray-700">{rule.name}</span>
              <span className="font-mono font-bold text-blue-600 bg-white px-3 py-1 rounded-lg border shadow-sm">{rule.code}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-4">
        <div className="p-3 bg-amber-500 text-white rounded-xl shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-lg">重要提示</h4>
          <p className="text-amber-800 text-sm mt-1">
            本系统已根据最新图片附件同步所有物料细分型号。在发放编码前，请确保“产品类别”与“产品名称”准确对应。系统将自动根据所选物料类型（1-9）生成对应格式的编码。
          </p>
        </div>
      </div>
    </div>
  );
};
