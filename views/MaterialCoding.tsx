
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { geminiService } from '../services/gemini';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { MaterialRecord } from '../types';

// 数据字典
const COMPANY_OPTIONS = [
  { value: '深圳市中科微光医疗器械技术有限公司', label: '深圳市中科微光医疗器械技术有限公司' }
];

const PRODUCT_TAXONOMY: Record<string, { label: string; code: string }[]> = {
  "血管成像仪类": [
    { label: "VIVO100", code: "01" }, { label: "VIVO200", code: "02" }, { label: "VIVO300", code: "03" }, 
    { label: "VIVO500", code: "04" }, { label: "VIVO500S", code: "05" }, { label: "红外增强器", code: "06" }, 
    { label: "V600", code: "07" }, { label: "V800F/V800P", code: "08" }, { label: "V800NV", code: "09" }, 
    { label: "SV800P", code: "10" }, { label: "V-glasses", code: "11" }, { label: "FL-100、FL-100 Pro", code: "12" },
  ],
  "医美类": [
    { label: "水光注射仪 Derma Elite", code: "01" }, 
    { label: "水光笔 (Skin 2 Skin Med Mini) / 负压枪 (Skin 2 Skin Med Mini Gun)", code: "02" }, 
    { label: "面部皮肤注射泵 Skin 2 Skin Med", code: "03" }, 
    { label: "面部皮肤注射泵 Hoya Beauty", code: "04" }, 
    { label: "光热脉动干眼治疗系统 CT-Combi", code: "05" }, 
    { label: "热脉动治疗探头 TPD", code: "06" }, 
    { label: "眼睑光子热敷仪 L01", code: "07" }, 
    { label: "眼部光敷仪 DWVLLLT-E", code: "08" },
  ],
  "OCT类": [
    { label: "心血管光学相干影像系统 P60", code: "01" }, 
    { label: "血管内成像系统 IS05", code: "02" }, 
    { label: "心血管光学相干影像系统 P80", code: "03" }, 
    { label: "心血管光学相干影像系统 Cornaris Mobile-E", code: "04" }, 
    { label: "心血管光学相干影像系统 Cornaris Mobile", code: "05" }, 
    { label: "OCT科研工作站 Desktop", code: "06" }, 
    { label: "OCT科研工作站 Laptop", code: "07" }, 
    { label: "心血管光学相干影像系统 P70", code: "08" }, 
    { label: "心血管光学相干影像系统 P80-E", code: "09" }, 
    { label: "劲动脉光学相干影像系统 ZERO", code: "10" }, 
    { label: "心血管光学相干影像系统 Cornaris Mobile+", code: "11" }, 
    { label: "心血管光学相干影像系统 Cornaris Integrated", code: "12" }, 
    { label: "心血管光学相干影像系统 Cornaris P80 Classic A", code: "13" }, 
    { label: "心血管光学相干影像系统 Cornaris P80 Classic B", code: "14" }, 
    { label: "心血管光学相干影像系统 Cornaris P80 Elite", code: "15" }, 
    { label: "心血管光学相干影像系统 Cornaris P80 Plus", code: "16" }, 
    { label: "基于OCT的血管内血流储备分数计算软件 VFR", code: "17" }, 
    { label: "心血管光学相干影像系统 Intravascular Imaging System P80-E", code: "18" }, 
    { label: "心血管光学相干影像系统 (印度零部件) InnoVLight", code: "19" }, 
    { label: "心血管光学相干影像系统 (印度零部件) InnoVLight Mobile", code: "20" }, 
    { label: "血管内光学相干影像系统 ZERO Mobile+", code: "21" }, 
    { label: "心血管光学相干影像系统 P80-E(FDA)", code: "22" }, 
    { label: "心血管光学相干影像系统 Mobile-E(FDA)", code: "23" }, 
    { label: "心血管光学相干影像系统 P80/P80-E(CE)", code: "24" }, 
    { label: "心血管光学相干影像系统 Mobile-E(CE)", code: "25" },
  ],
  "导管类": [
    { label: "消化道导管", code: "01" }, 
    { label: "心血管导管", code: "02" }, 
    { label: "一次性使用血管内成像导管 Pathfinder 164", code: "03" }, 
    { label: "一次性使用血管内成像导管 Earthworm系列 (F1/M1/F2/M2/A2/C2/X2/E2/S2/P2)", code: "04" }, 
    { label: "CLA导管", code: "05" }, 
    { label: "一次性使用颅内动脉成像导管 IC019", code: "06" }, 
    { label: "一次性使用颅内动脉成像导管 IC018-40/IC018-60", code: "07" }, 
    { label: "一次性冷凝激光斑块消融导管 (冠脉) LS200-09/14/17", code: "08" }, 
    { label: "一次性使用血管内成像导管 Lumenpilot F2", code: "09" }, 
    { label: "一次性使用医用激光光纤 SRF/CF/BF/TRF系列", code: "10" }, 
    { label: "印度零部件OCT导管 F2", code: "11" }, 
    { label: "一次性使用血管内成像导管 Pathfinder 164、F2", code: "12" }, 
    { label: "一次性使用血管内成像导管 / Disposable Intravascular Imaging Catheterh", code: "13" },
  ],
  "激光消融类": [
    { label: "激光消融 CLA", code: "01" }, 
    { label: "CLA-355C", code: "02" }
  ],
  "超声类": [
    { label: "血管内超声 IVUS", code: "01" }
  ],
  "内窥镜类": [
    { label: "内窥镜摄像系统 iScope", code: "01" }, 
    { label: "电子内窥镜图像处理器 VL100", code: "02" }
  ],
  "震波碎石类": [
    { label: "血管内震波碎石系统 C100", code: "01" }
  ],
  "钛激光类": [
    { label: "超脉冲铥激光治疗系统 Superpulse Thulium laser system T80", code: "01" }
  ],
  "激光类": [
    { label: "Diode laser system 半导体激光系统 DLS-1470/980", code: "01" }, 
    { label: "半导体激光系统 (Diode laser system) DLS-1470", code: "02" }, 
    { label: "激光口腔综合治疗仪 XN01", code: "03" }, 
    { label: "一次性使用静脉腔内射频闭合导管 RF-3-60、RF-7-60 (中国)", code: "04" }, 
    { label: "一次性使用静脉腔内射频闭合导管 RF-3-60、RF-7-60 (欧美)", code: "05" }, 
    { label: "一次性使用静脉腔内射频闭合导管 RF-3-60、RF-7-60 (美洲)", code: "06" }, 
    { label: "一次性使用激光光纤 LF-R-400系列与LF-R-600 (中国)", code: "07" }, 
    { label: "一次性使用激光光纤 LF-R系列、LF-B系列 (欧洲)", code: "08" }, 
    { label: "一次性使用激光光纤 LF-R系列、PF-C系列、LF-B系列 (美洲)", code: "09" }, 
    { label: "静脉腔内闭合系统 RF-Laser Thermal Ablation System RFL-I (中国)", code: "10" }, 
    { label: "静脉腔内闭合系统 RF-Laser Thermal Ablation System RFL-I (欧洲)", code: "11" }, 
    { label: "静脉腔内闭合系统 RF-Laser Thermal Ablation System RFL-I (美洲)", code: "12" },
  ],
  "其它": [
    { label: "脑部近红外激光辐照仪 / Brain NIR Laser Irradiator", code: "01" }, 
    { label: "眼科飞秒激光治疗系统 Ophthalmic Femtosecond laser Advanced System of Treatment", code: "02" }, 
    { label: "一次性使用负压吸引透镜 Patient Interface Device", code: "03" }, 
    { label: "强脉冲光治疗仪 Puwa 6、Puwa 8", code: "04" }, 
    { label: "高压氧舱 HO 15", code: "05" }, 
    { label: "脑部红光辐照仪 BRI-600", code: "06" }, 
    { label: "40Hz光声神经调控仪", code: "07" }, 
    { label: "电子皮肤镜影像系统 MS 9", code: "08" }, 
    { label: "手术影像记录仪 MS 9", code: "09" }, 
    { label: "荧光显微镜 MS Plus 9", code: "10" }, 
    { label: "光敷治疗站 Lumineyes, Pro, Ultra", code: "11" }, 
    { label: "眼科飞秒激光治疗系统 OFAST-4000A", code: "12" },
  ]
};

const MID_CODE_MAP: Record<string, string> = {
  "血管成像仪类": "100", "医美类": "200", "OCT类": "300", "导管类": "500", 
  "激光消融类": "600", "超声类": "700", "内窥镜类": "800", "震波碎石类": "900", 
  "钛激光类": "A00", "激光类": "B00", "其它": "C00"
};

// --- 电阻参数数据 ---
const RES_PACKAGE_OPTIONS = [
  { value: '', label: '请选择电阻封装' },
  { value: '0201', label: '0201' }, { value: '0402', label: '0402' }, { value: '0603', label: '0603' },
  { value: '0805', label: '0805' }, { value: '1206', label: '1206' }, { value: '1210', label: '1210' },
  { value: '1812', label: '1812' }, { value: '2010', label: '2010' }, { value: '2512', label: '2512' },
  { value: '其他', label: '其他电阻封装' }
];

const RES_TOLERANCE_OPTIONS = [
  { value: '', label: '请选择电阻精度' },
  { value: '1%', label: '1%' }, { value: '2%', label: '2%' }, { value: '5%', label: '5%' },
  { value: '10%', label: '10%' }, { value: '15%', label: '15%' }, { value: '20%', label: '20%' },
  { value: '其他', label: '其他电阻精度' }
];

const RES_TYPE_OPTIONS = [
  { value: '', label: '请选择电阻类型' },
  { value: '贴片电阻', label: '贴片电阻' }, { value: '插件电阻', label: '插件电阻' }, 
  { value: '贴片排阻', label: '贴片排阻' }, { value: '其他', label: '其他' }
];

// --- 电容参数数据 ---
const CAP_VOLTAGE_OPTIONS = [
  { value: '', label: '请选择耐压值' },
  { value: '4V', label: '4V' }, { value: '6.3V', label: '6.3V' }, { value: '10V', label: '10V' },
  { value: '16V', label: '16V' }, { value: '25V', label: '25V' }, { value: '35V', label: '35V' },
  { value: '50V', label: '50V' }, { value: '其他', label: '其他' }
];

const CAP_PACKAGE_OPTIONS = [
  { value: '', label: '请选择电容封装' },
  { value: '0201', label: '0201' }, { value: '0402', label: '0402' }, { value: '0603', label: '0603' },
  { value: '0805', label: '0805' }, { value: '1206', label: '1206' }, { value: '1210', label: '1210' },
  { value: '1808', label: '1808' }, { value: '1812', label: '1812' }, { value: '2220', label: '2220' },
  { value: '2225', label: '2225' }, { value: '2512', label: '2512' }, { value: '3035', label: '3035' },
  { value: '3216', label: '3216' }, { value: '3518', label: '3518' }, { value: '6032', label: '6032' },
  { value: '其他', label: '其他电容封装规格' }
];

const CAP_TOLERANCE_OPTIONS = [
  { value: '', label: '请选择电容精度' },
  { value: '1%', label: '1%' }, { value: '2%', label: '2%' }, { value: '5%', label: '5%' },
  { value: '10%', label: '10%' }, { value: '15%', label: '15%' }, { value: '20%', label: '20%' },
  { value: '其他', label: '其他电容精度' }
];

const CAP_MATERIAL_OPTIONS = [
  { value: '', label: '请选择电容材质' },
  { value: 'X5R', label: 'X5R' }, { value: 'X7R', label: 'X7R' }, { value: 'Y5V', label: 'Y5V' },
  { value: 'NPO', label: 'NPO' }, { value: 'COG', label: 'COG' }, { value: '其他', label: '其他电容材质' }
];

const CAP_TYPE_OPTIONS = [
  { value: '', label: '请选择电容类型' },
  { value: '贴片电容', label: '贴片电容' }, { value: '插件电容', label: '插件电容' }, { value: '其他', label: '其他' }
];

// --- 其他大类数据 ---
const PLASTIC_OPTIONS = [
  { value: '', label: '请选择塑胶类别' },
  { value: '01', label: '壳体' }, { value: '02', label: '电池盖' }, { value: '03', label: '按键' },
  { value: '04', label: '灯罩' }, { value: '05', label: '面板' }, { value: '06', label: '装饰圈' },
  { value: '07', label: '塑胶' }, { value: '00', label: '其他' },
];

const OPTICAL_OPTIONS = [
  { value: '', label: '请选择光学类别' },
  { value: '01', label: '镜片类' }, { value: '02', label: '光学连接件' }, { value: '03', label: '镜片组类' },
  { value: '04', label: '光纤类' }, { value: '05', label: '光源类' }, { value: '06', label: '光信号处理类' },
  { value: '07', label: '光信号采集类' }, { value: '00', label: '其他' },
];

const PACKAGING_OPTIONS = [
  { value: '', label: '请选择包材类别' },
  { value: '01', label: '包装袋' }, { value: '02', label: '包装盒' }, { value: '03', label: '包装箱' },
  { value: '04', label: '标签' }, { value: '05', label: '防潮珠' }, { value: '06', label: '内衬' },
  { value: '07', label: '泡棉' }, { value: '08', label: '珍珠棉' }, { value: '09', label: '说明书' },
  { value: '10', label: '合格证' }, { value: '11', label: '保修卡' }, { value: '12', label: '装箱单' },
  { value: '00', label: '其他' },
];

const AUX_OPTIONS = [
  { value: '', label: '请选择辅料耗材类别' },
  { value: '01', label: '辅料类' }, { value: '02', label: '耗材类' }
];

const PIPE_TOOL_OPTIONS = [
  { value: '', label: '请选择管材工具类别' },
  { value: '01', label: '管材类' }, { value: '02', label: '工具类' }
];

const ELECTRONIC_OPTIONS = [
  { value: '', label: '请选择电子类别' },
  { value: '01', label: 'PCB' }, { value: '02', label: '电阻' }, { value: '03', label: '电容' },
  { value: '04', label: '电感' }, { value: '05', label: '二极管' }, { value: '06', label: '三极管' },
  { value: '07', label: 'MOS管' }, { value: '08', label: '晶振' }, { value: '09', label: '芯片' },
  { value: '10', label: '蜂鸣器' }, { value: '00', label: '其他类' },
];

const MECHANICAL_OPTIONS = [
  { value: '', label: '请选择机械类型' },
  { value: '01', label: '金属' }, { value: '02', label: '垫圈' }, { value: '03', label: '垫片' },
  { value: '04', label: '胶垫' }, { value: '05', label: '胶圈' }, { value: '06', label: '胶塞' },
  { value: '07', label: '螺母' }, { value: '08', label: '螺丝' }, { value: '09', label: '螺柱' },
  { value: '00', label: '其他' },
];

const MATERIAL_TYPE_OPTIONS = [
  { value: '', label: '请选择物料类型' },
  { value: '成品类', label: '成品' }, { value: '半成品类', label: '半成品' }, { value: '电子类', label: '电子类' },
  { value: '机械类', label: '机械类' }, { value: '塑胶类', label: '塑胶类' }, { value: '光学类', label: '光学类' },
  { value: '包材类', label: '包材类' }, { value: '辅料耗材类', label: '辅料耗材类' }, { value: '管材工具类', label: '管材工具类' },
];

const UOM_OPTIONS = [
  { value: '', label: '请选择计量单位' },
  { value: '把', label: '把' }, { value: '个', label: '个' }, { value: '根', label: '根' },
  { value: '件', label: '件' }, { value: '卷', label: '卷' }, { value: '颗', label: '颗' },
  { value: '米', label: '米' }, { value: '台', label: '台' }, { value: '套', label: '套' }, { value: 'PCS', label: 'PCS' }
];

export const MaterialCoding: React.FC = () => {
  const [productType, setProductType] = useState('');
  const [company, setCompany] = useState('深圳市中科微光医疗器械技术有限公司');
  const [requester, setRequester] = useState('');
  const [showResGuidance, setShowResGuidance] = useState(false);
  const [showCapGuidance, setShowCapGuidance] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    name: '', specification: '', productCategory: '', productName: '', uom: '', languageType: '', version: '10',
    electronicCategory: '', mechanicalCategory: '', plasticCategory: '', opticalCategory: '', packagingCategory: '',
    auxCategory: '', pipeToolCategory: '', screwSize: '', componentCategory: '',
    resValue: '', resPackage: '', resTolerance: '', resType: '',
    capValue: '', capVoltage: '', capPackage: '', capTolerance: '', capMaterial: '', capType: ''
  });

  const [loading, setLoading] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);
  const [records, setRecords] = useState<MaterialRecord[]>([]);

  useEffect(() => {
    setRecords(storageService.getMaterials());
  }, []);

  const generateNewCode = () => {
    if (!productType || !formData.productCategory || !formData.productName) return "等待参数完善...";
    
    const prefixMap: any = { 
      '成品类': '1', '半成品类': '2', '电子类': '3', '机械类': '4', '塑胶类': '5',
      '光学类': '6', '包材类': '7', '辅料耗材类': '8', '管材工具类': '9'
    };
    const root = prefixMap[productType] || '0';
    const midCode = MID_CODE_MAP[formData.productCategory] || '000';
    
    let subCode = '00';
    if (productType === '电子类') subCode = formData.electronicCategory;
    else if (productType === '机械类') subCode = formData.mechanicalCategory;
    else if (productType === '塑胶类') subCode = formData.plasticCategory;
    else if (productType === '光学类') subCode = formData.opticalCategory;
    else if (productType === '包材类') subCode = formData.packagingCategory;
    else if (productType === '辅料耗材类') subCode = formData.auxCategory;
    else if (productType === '管材工具类') subCode = formData.pipeToolCategory;
    else {
      const selectedSmall = PRODUCT_TAXONOMY[formData.productCategory]?.find(i => i.label === formData.productName);
      subCode = selectedSmall?.code || '00';
    }

    const count = records.filter(m => m.productType === productType && m.productCategory === formData.productCategory).length + 1;
    const serial = count.toString().padStart(3, '0');

    if (productType === '成品类') {
      const lang = formData.languageType || '00';
      const ver = formData.version || '10';
      return `${root}${midCode}${subCode}${lang}${ver}${serial}`;
    }

    return `${root}-${midCode}-${subCode || '00'}-${serial}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requester || !productType || !formData.name || !formData.productCategory || !formData.productName) {
      alert('请确保：申请人及带*项已填写完整！');
      return;
    }
    setLoading(true);
    const code = generateNewCode();
    const check = await geminiService.checkFuzzyMatch(formData.name, formData.specification, records);
    if (check.matchFound) {
      setDuplicateWarning({ reason: check.reason });
      setLoading(false);
      return;
    }
    saveRecord(code);
  };

  const saveRecord = (code: string) => {
    const newRecord: MaterialRecord = {
      id: Date.now().toString(),
      code, company, productType, requester, ...formData,
      createdAt: new Date().toISOString(),
      creator: 'Admin',
      status: 'active'
    };
    storageService.saveMaterial(newRecord);
    setRecords(storageService.getMaterials());
    alert(`编码发放成功: ${code}`);
    setFormData({ ...formData, name: '', specification: '', uom: '', screwSize: '' });
    setLoading(false);
    setDuplicateWarning(null);
  };

  const showUom = productType !== '成品类' && productType !== '';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 p-8 text-white">
          <h2 className="text-2xl font-black tracking-tight text-center">物料编码发放系统</h2>
          <p className="text-blue-100 text-sm mt-1 opacity-80 text-center">符合 ISO 体系标准 · 智能参数指导</p>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <Input isSelect label="所属公司" options={COMPANY_OPTIONS} value={company} onChange={e => setCompany(e.target.value)} />
            <Input label="申请人*" placeholder="您的姓名" value={requester} onChange={e => setRequester(e.target.value)} />
            <Input isSelect label="物料类型*" options={MATERIAL_TYPE_OPTIONS} value={productType} onChange={e => {
              setProductType(e.target.value);
              setFormData({...formData, electronicCategory:'', mechanicalCategory:'', plasticCategory:'', opticalCategory:'', packagingCategory:'', auxCategory:'', pipeToolCategory:'', uom:''});
            }} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本信息区 */}
            <div className={`grid grid-cols-1 md:grid-cols-2 ${showUom ? 'lg:grid-cols-3' : ''} gap-6`}>
              <Input label="物料名称*" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="输入物料名称" />
              <Input label="规格型号*" value={formData.specification} onChange={e => setFormData({...formData, specification: e.target.value})} placeholder="输入规格型号" />
              {showUom && (
                <div className="animate-in slide-in-from-top-2">
                  <Input isSelect label="计量单位" options={UOM_OPTIONS} value={formData.uom} onChange={e => setFormData({...formData, uom: e.target.value})} />
                </div>
              )}
            </div>

            {/* 产品关联区 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input isSelect label="产品类别*" options={[{value:'', label:'请选择类别'}, ...Object.keys(MID_CODE_MAP).map(k=>({value:k, label:k}))]} value={formData.productCategory} onChange={e => setFormData({...formData, productCategory: e.target.value, productName: ''})} />
              <Input isSelect label="产品名称*" options={[{value:'', label:'请选择型号'}, ...(PRODUCT_TAXONOMY[formData.productCategory] || []).map(i=>({value:i.label, label:i.label}))]} value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
            </div>

            {/* 动态细分类别区域 */}
            <div className="animate-in slide-in-from-top-2 space-y-6">
              {productType === '电子类' && (
                <>
                  <Input isSelect label="电子类别*" options={ELECTRONIC_OPTIONS} value={formData.electronicCategory} onChange={e => setFormData({...formData, electronicCategory: e.target.value})} />
                  
                  {/* 电阻专项 */}
                  {formData.electronicCategory === '02' && (
                    <div className="p-6 bg-orange-50/50 rounded-2xl border border-orange-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in zoom-in-95">
                      <div className="col-span-full flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-orange-800 uppercase tracking-widest">电阻技术参数 (Resistor)</span>
                      </div>
                      <div className="relative">
                        <Input 
                          label="电阻值*" 
                          value={formData.resValue} 
                          onFocus={() => setShowResGuidance(true)}
                          onBlur={() => setShowResGuidance(false)}
                          onChange={e => setFormData({...formData, resValue: e.target.value})} 
                          placeholder="例如: 6R20 / 6802" 
                        />
                        {showResGuidance && (
                          <div className="absolute z-20 top-full mt-2 w-72 p-4 bg-gray-900 text-white text-[11px] rounded-xl shadow-2xl leading-relaxed animate-in fade-in slide-in-from-top-1">
                            <p className="font-bold text-orange-400 mb-1">电阻阻值数字表示法指导：</p>
                            前两位数字代表有效数字，第三位数字表示后面应添加“0”的个数。当电阻小于100Ω时，用 R 表示小数点。
                            <br/><br/>
                            例: 6R20=6.2Ω, 33R0=33Ω, 2200=220Ω, 6802=68KΩ。
                          </div>
                        )}
                      </div>
                      <Input isSelect label="电阻封装*" options={RES_PACKAGE_OPTIONS} value={formData.resPackage} onChange={e => setFormData({...formData, resPackage: e.target.value})} />
                      <Input isSelect label="电阻精度*" options={RES_TOLERANCE_OPTIONS} value={formData.resTolerance} onChange={e => setFormData({...formData, resTolerance: e.target.value})} />
                      <Input isSelect label="电阻类型*" options={RES_TYPE_OPTIONS} value={formData.resType} onChange={e => setFormData({...formData, resType: e.target.value})} />
                    </div>
                  )}

                  {/* 电容专项 */}
                  {formData.electronicCategory === '03' && (
                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in zoom-in-95">
                      <div className="col-span-full flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-blue-800 uppercase tracking-widest">电容技术参数 (Capacitor)</span>
                      </div>
                      <div className="relative">
                        <Input 
                          label="电容容量*" 
                          value={formData.capValue} 
                          onFocus={() => setShowCapGuidance(true)}
                          onBlur={() => setShowCapGuidance(false)}
                          onChange={e => setFormData({...formData, capValue: e.target.value})} 
                          placeholder="例如: 229 / 22R" 
                        />
                        {showCapGuidance && (
                          <div className="absolute z-20 top-full mt-2 w-80 p-4 bg-gray-900 text-white text-[11px] rounded-xl shadow-2xl leading-relaxed animate-in fade-in slide-in-from-top-1">
                            <p className="font-bold text-blue-400 mb-1">电容容量表示法指导：</p>
                            由三位数字组成，前两位为有效数字，第三位为倍率。
                            <br/>- 尾数为0时默认单位uF
                            <br/>- 尾数1-8时默认单位pF
                            <br/>- 尾数9时倍率为10^-1 (如229=2.2pF)
                            <br/>- 1~100pF之间用 R (如22R=22pF)
                          </div>
                        )}
                      </div>
                      <Input isSelect label="电容耐压值*" options={CAP_VOLTAGE_OPTIONS} value={formData.capVoltage} onChange={e => setFormData({...formData, capVoltage: e.target.value})} />
                      <Input isSelect label="电容封装*" options={CAP_PACKAGE_OPTIONS} value={formData.capPackage} onChange={e => setFormData({...formData, capPackage: e.target.value})} />
                      <Input isSelect label="电容精度*" options={CAP_TOLERANCE_OPTIONS} value={formData.capTolerance} onChange={e => setFormData({...formData, capTolerance: e.target.value})} />
                      <Input isSelect label="电容材质*" options={CAP_MATERIAL_OPTIONS} value={formData.capMaterial} onChange={e => setFormData({...formData, capMaterial: e.target.value})} />
                      <Input isSelect label="电容类型*" options={CAP_TYPE_OPTIONS} value={formData.capType} onChange={e => setFormData({...formData, capType: e.target.value})} />
                    </div>
                  )}
                </>
              )}

              {productType === '机械类' && (
                <>
                  <Input isSelect label="机械类型*" options={MECHANICAL_OPTIONS} value={formData.mechanicalCategory} onChange={e => setFormData({...formData, mechanicalCategory: e.target.value})} />
                  {formData.mechanicalCategory === '08' && <Input label="螺丝尺寸*" value={formData.screwSize} onChange={e => setFormData({...formData, screwSize: e.target.value})} placeholder="例如：M3X10，则填写0310" />}
                </>
              )}
              {productType === '塑胶类' && <Input isSelect label="塑胶类别*" options={PLASTIC_OPTIONS} value={formData.plasticCategory} onChange={e => setFormData({...formData, plasticCategory: e.target.value})} />}
              {productType === '光学类' && <Input isSelect label="光学类别*" options={OPTICAL_OPTIONS} value={formData.opticalCategory} onChange={e => setFormData({...formData, opticalCategory: e.target.value})} />}
              {productType === '包材类' && <Input isSelect label="包材类别*" options={PACKAGING_OPTIONS} value={formData.packagingCategory} onChange={e => setFormData({...formData, packagingCategory: e.target.value})} />}
              {productType === '辅料耗材类' && <Input isSelect label="辅料耗材类别*" options={AUX_OPTIONS} value={formData.auxCategory} onChange={e => setFormData({...formData, auxCategory: e.target.value})} />}
              {productType === '管材工具类' && <Input isSelect label="管材工具类别*" options={PIPE_TOOL_OPTIONS} value={formData.pipeToolCategory} onChange={e => setFormData({...formData, pipeToolCategory: e.target.value})} />}
            </div>

            <div className="mt-12 py-8 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-100 flex flex-col items-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">编码预览</span>
              <div className="text-4xl md:text-5xl font-mono font-black text-blue-900 tracking-tighter mt-2">
                {generateNewCode()}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button type="submit" isLoading={loading} className="px-24 py-5 rounded-2xl shadow-xl text-xl hover:scale-105 active:scale-95 transition-all">
                核准发放编码
              </Button>
            </div>
          </form>

          {duplicateWarning && (
            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-2xl animate-in zoom-in-95">
              <h4 className="text-red-800 font-bold">⚠️ 疑似重复物料</h4>
              <p className="text-red-700 text-sm mt-1">{duplicateWarning.reason}</p>
              <div className="mt-4 flex space-x-3">
                <Button variant="danger" className="px-6" onClick={() => saveRecord(generateNewCode())}>强制发放</Button>
                <Button variant="secondary" className="px-6" onClick={() => setDuplicateWarning(null)}>取消修改</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
