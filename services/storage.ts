
import { MaterialRecord, FileRecord, OperationLog, ProductModel, CategoryType } from '../types';

const KEYS = {
  MATERIALS: 'app_materials',
  FILES: 'app_files',
  LOGS: 'app_logs',
  PRODUCTS: 'app_products',
  RULES: 'app_rules',
  SESSION_LOCK: 'app_session_lock'
};

export const storageService = {
  getMaterials: (): MaterialRecord[] => JSON.parse(localStorage.getItem(KEYS.MATERIALS) || '[]'),
  saveMaterial: (record: MaterialRecord) => {
    const data = storageService.getMaterials();
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify([record, ...data]));
    storageService.addLog('系统', '新增物料', record.code, `生成物料编码: ${record.code}`);
  },
  
  updateMaterial: (id: string, updates: Partial<MaterialRecord>) => {
    const data = storageService.getMaterials();
    const updated = data.map(m => m.id === id ? { ...m, ...updates } : m);
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(updated));
  },

  getFiles: (): FileRecord[] => JSON.parse(localStorage.getItem(KEYS.FILES) || '[]'),
  saveFile: (record: FileRecord) => {
    const data = storageService.getFiles();
    localStorage.setItem(KEYS.FILES, JSON.stringify([record, ...data]));
    storageService.addLog('系统', '新增文件', record.code, `生成文件编码: ${record.code}`);
  },

  getProducts: (): ProductModel[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : [
      { id: '1', code: 'A', name: 'A系列产品' },
      { id: '2', code: 'B', name: 'B系列产品' }
    ];
  },
  saveProduct: (product: ProductModel) => {
    const data = storageService.getProducts();
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify([...data, product]));
  },

  getLogs: (): OperationLog[] => JSON.parse(localStorage.getItem(KEYS.LOGS) || '[]'),
  addLog: (operator: string, action: string, target: string, details: string) => {
    const logs = storageService.getLogs();
    const newLog: OperationLog = {
      id: Date.now().toString(),
      operator,
      action,
      target,
      details,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(KEYS.LOGS, JSON.stringify([newLog, ...logs].slice(0, 1000)));
  },

  checkSessionLock: (user: string): boolean => {
    const lock = localStorage.getItem(KEYS.SESSION_LOCK);
    if (!lock) {
      localStorage.setItem(KEYS.SESSION_LOCK, JSON.stringify({ user, time: Date.now() }));
      return true;
    }
    const lockData = JSON.parse(lock);
    if (Date.now() - lockData.time > 300000) { // 5 mins timeout
      localStorage.setItem(KEYS.SESSION_LOCK, JSON.stringify({ user, time: Date.now() }));
      return true;
    }
    return lockData.user === user;
  },
  
  releaseLock: () => localStorage.removeItem(KEYS.SESSION_LOCK)
};
