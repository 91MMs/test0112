
export enum CategoryType {
  MATERIAL = 'MATERIAL',
  FILE = 'FILE'
}

export interface MaterialRecord {
  id: string;
  code: string;
  name: string;
  specification: string;
  company: string;
  productType: string;
  requester: string; // 申请人
  
  // 扩展字段
  productCategory?: string;    // 产品类别
  productName?: string;        // 产品名称
  uom?: string;                // 计量单位
  languageType?: string;       // 语言类别
  version?: string;            // 版本
  componentCategory?: string;  // 组件类别
  
  // 各类别的子分类
  electronicCategory?: string; // 电子类别
  mechanicalCategory?: string; // 机械类别
  plasticCategory?: string;    // 塑胶类别
  opticalCategory?: string;    // 光学类别
  packagingCategory?: string;  // 包材类别
  auxCategory?: string;        // 辅料耗材类别
  pipeToolCategory?: string;   // 管材工具类别
  
  screwSize?: string;          // 螺丝尺寸 (例如：0310)
  
  // 电容/电阻参数
  capCapacitance?: string; capVoltage?: string; capPackage?: string;
  resValue?: string; resPackage?: string;
  
  createdAt: string;
  creator: string;
  status: 'active' | 'reclaimed';
}

export interface FileRecord {
  id: string;
  code: string;
  fileName: string;
  version: string;
  projectModel: string;
  createdAt: string;
  creator: string;
}

export interface OperationLog {
  id: string;
  operator: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface ProductModel {
  id: string;
  code: string;
  name: string;
}
