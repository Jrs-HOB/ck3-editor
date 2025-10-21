import React, { useState } from 'react';
import { Layout, Card, Button, Input, Space, Collapse } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import './App.css';
import ConditionBuilder from './components/ConditionBuilder';
import FieldVisibilityControl from './components/FieldVisibilityControl';


const { Header, Sider, Content } = Layout;
const { TextArea } = Input;
const { Panel } = Collapse;

// 更新字段配置接口
interface FieldConfig {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
  value: string;
  description: string;
  required: boolean;
  visible: boolean; // 新增可见性控制
}

// 定义条件接口（与 ConditionBuilder 中的一致）
interface Condition {
  id: string;
  type: 'is_landed' | 'age' | 'gold' | 'is_available' | string;
  operator: '=' | '>=' | '<=' | '>' | '<' | string;
  value: string;
}

// 定义活动类型的数据结构
interface ActivityType {
  activityType: string;
  name: string;
  description: string;
  isShownConditions: Condition[];
  activityGroupType: string;
  sortOrder: string;
  canStartConditions: Condition[];
  canStartShowingFailuresOnlyConditions: Condition[];
  canPlanConditions: Condition[];
  customFields: FieldConfig[];
}


function App() {
  const HEADER_HEIGHT = 64; // 顶部栏高度（px）

  // 使用 useState 来管理组件状态
  const [activity, setActivity] = useState<ActivityType>({
    activityType: 'activity_type',
    name: '自定义活动',
    description: '这是一个自定义的活动',
    isShownConditions: [
      { id: '1', type: 'is_landed', operator: '=', value: 'yes' }
    ],
    activityGroupType: 'activities',
    sortOrder: '0',
    canStartConditions: [
      { id: '2', type: 'is_available', operator: '=', value: 'yes' }
    ],
    canStartShowingFailuresOnlyConditions: [
      { id: '3', type: 'age', operator: '>=', value: '18' }
    ],
    canPlanConditions: [
      { id: '4', type: 'gold', operator: '>=', value: '100' }
    ],
    customFields: []
  });


  // 保存为文件
  const handleSaveToFile = () => {
    const code = generateCode(activity);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activity.activityType}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 导入文件（简单读取内容，实际需解析）
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('导入的文件内容:', content);
        alert('文件已读取，控制台输出内容（需要实现解析逻辑）');
      };
      reader.readAsText(file);
    }
  };


  const renderCustomFields = () => {
    return activity.customFields.map((field) => (
      <div key={field.id}>
        <label>{field.label}:</label>
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
          {field.description}
        </div>
        {field.type === 'textarea' ? (
          <TextArea
            value={field.value}
            onChange={(e) => {
              const newFields = activity.customFields.map(f => 
                f.id === field.id ? { ...f, value: e.target.value } : f
              );
              setActivity({ ...activity, customFields: newFields });
            }}
            rows={3}
          />
        ) : (
          <Input
            value={field.value}
            onChange={(e) => {
              const newFields = activity.customFields.map(f => 
                f.id === field.id ? { ...f, value: e.target.value } : f
              );
              setActivity({ ...activity, customFields: newFields });
            }}
            type={field.type === 'number' ? 'number' : 'text'}
          />
        )}
      </div>
    ));
  };
  
  return (
    <Layout style={{ height: '100vh' }}>
      {/* 固定顶部标题栏 */}
      <Header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        lineHeight: `${HEADER_HEIGHT}px`,
        background: '#1890ff',
        color: 'white',
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 1000
      }}>
         <div style={{ fontWeight: 600 }}>十字军之王3 - 活动编辑器</div>
 
         <div style={{ display: 'flex', gap: 8 }}>
           <Button
             type="default"
             icon={<SaveOutlined />}
             ghost
             onClick={handleSaveToFile}
           >
             保存为文件
           </Button>
 
           <Button
             type="default"
             ghost
             onClick={() => document.getElementById('import-file')?.click()}
           >
             导入活动文件
           </Button>
         </div>
      </Header>
      
      {/* 主体区域：向下偏移以避开固定的 header，并使左右区域各自可滚动 */}
      <Layout style={{ marginTop: HEADER_HEIGHT }}>
         {/* 左侧面板 - 属性编辑 */}
        <Sider
          width={500}
          style={{
            background: '#f0f2f5',
            padding: '16px',
            height: `calc(100vh - ${HEADER_HEIGHT}px)`,
            overflowY: 'auto'
          }}
        >
           <Collapse defaultActiveKey={['basic', 'conditions']}>
            <Panel header="基础属性" key="basic">
              <Space direction="vertical" style={{ width: '100%' }}>

               <div>
                 <label>活动键值:</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  活动的唯一标识符，用于在游戏中引用此活动
                 </div>
                 <Input 
                   value={activity.activityType}
                   onChange={(e) => setActivity({...activity, activityType: e.target.value})}
                 />
               </div>
               
               <div>
                 <label>活动名称:</label>
                 <Input 
                   value={activity.name}
                   onChange={(e) => setActivity({...activity, name: e.target.value})}
                 />
               </div>
               
               <div>
                 <label>活动描述:</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  活动的唯一标识符，用于在游戏中引用此活动
                 </div>
                 <TextArea 
                   value={activity.description}
                   onChange={(e) => setActivity({...activity, description: e.target.value})}
                   rows={3}
                 />
               </div>
              </Space>
            </Panel>
               
            <Panel header="条件设置" key="conditions">
              <Space direction="vertical" style={{ width: '100%' }}>

               <div>
                 <label>显示条件 (is_shown):</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  符合以下条件的角色才能看到这个活动
                 </div>
                 <ConditionBuilder
                   conditions={activity.isShownConditions}
                   onChange={(conditions) => setActivity({...activity, isShownConditions: conditions})}
                 />
               </div>

               <div>
                 <label>活动组别类型:</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  基于此决定该活动所使用的gui模板，默认为"activities"
                 </div>
                 <Input 
                   value={activity.activityGroupType}
                   onChange={(e) => setActivity({...activity, activityGroupType: e.target.value})}
                 />
               </div>

               <div>
                 <label>活动序列:</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  基于此决定该活动在其组别内的排序位置，数值越大优先级越高
                 </div>
                 <Input 
                   value={activity.sortOrder}
                   onChange={(e) => setActivity({...activity, sortOrder: e.target.value})}
                 />
               </div>

               <div>
                 <label>开始条件（显示所有条件） (can_start):</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  符合以下条件的角色才能执行这个活动
                 </div>
                 <ConditionBuilder
                   conditions={activity.canStartConditions}
                   onChange={(conditions) => setActivity({...activity, canStartConditions: conditions})}
                 />
               </div>

               <div>
                 <label>开始条件（仅显示不符合的条件） (can_start_showing_failures_only):</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  符合以下条件的角色才能执行这个活动
                 </div>
                 <ConditionBuilder
                   conditions={activity.canStartShowingFailuresOnlyConditions}
                   onChange={(conditions) => setActivity({...activity, canStartShowingFailuresOnlyConditions: conditions})}
                 />
               </div>

               <div>
                 <label>开始条件（仅显示不符合的条件） (can_start_showing_failures_only):</label>
                 <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  符合以下条件的角色才能执行这个活动
                 </div>
                 <ConditionBuilder
                   conditions={activity.canStartShowingFailuresOnlyConditions}
                   onChange={(conditions) => setActivity({...activity, canStartShowingFailuresOnlyConditions: conditions})}
                 />
               </div>
                 </Space>
            </Panel>

            <Panel header="自定义字段" key="custom">
              <Space direction="vertical" style={{ width: '100%' }}>
                <FieldEditor
                  fields={activity.customFields}
                  onChange={(fields) => setActivity({...activity, customFields: fields})}
                />
                {renderCustomFields()}
              </Space>
            </Panel>
          </Collapse>
              

              {/* 隐藏的文件输入，用于导入 */}
              <input
                type="file"
                accept=".txt"
                onChange={handleImportFile}
                style={{ display: 'none' }}
                id="import-file"
              />



        </Sider>
        
        {/* 中央内容区：单独滚动 */}
        <Content style={{
          padding: '16px',
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
          overflowY: 'auto'
        }}>
          <Card title="活动预览" style={{ height: '100%' }}>
            <div style={{ padding: '20px' }}>
              <h2>{activity.name}</h2>
              <p><strong>活动键值:</strong> {activity.activityType}</p>
              <p><strong>描述:</strong> {activity.description}</p>
              <p><strong>显示条件:</strong> {activity.isShownConditions.map(c => `${c.type} ${c.operator} ${c.value}`).join('; ')}</p>
              <p><strong>活动组别类型:</strong> {activity.activityGroupType}</p>
              <p><strong>活动序列:</strong> {activity.sortOrder}</p>
              <p><strong>开始条件（显示所有条件）:</strong> {activity.canStartConditions.map(c => `${c.type} ${c.operator} ${c.value}`).join('; ')}</p>
              <p><strong>开始条件（仅显示不符合的条件）:</strong> {activity.canStartShowingFailuresOnlyConditions.map(c => `${c.type} ${c.operator} ${c.value}`).join('; ')}</p>
            </div>

            <div style={{ marginTop: '20px' }}>
              <h3>生成的代码预览：</h3>
              <pre style={{
                background: '#f5f5f5',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                maxHeight: '300px',
                overflow: 'auto'
              }}>
                {generateCode(activity)}
              </pre>
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
   );
 }

// 代码生成函数（基于条件数组）
function generateConditionsBlock(conditions: Condition[], indent: string) {
  return conditions.map(c => `${indent}${c.type} ${c.operator} ${c.value}`).join('\n');
}

function generateCode(activity: ActivityType): string {
  return `${activity.activityType} = {
\tis_shown = {
${generateConditionsBlock(activity.isShownConditions, '\t\t')}
\t}
\tactivity_group_type = ${activity.activityGroupType}
\tsort_order = ${activity.sortOrder}
\tcan_start = {
${generateConditionsBlock(activity.canStartConditions, '\t\t')}
\t}
\tcan_start_showing_failures_only = {
${generateConditionsBlock(activity.canStartShowingFailuresOnlyConditions, '\t\t')}
\t}

}`;
}

export default App