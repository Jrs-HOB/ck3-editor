import React from 'react';
import { Card, Select, Input, Button, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

interface Condition {
  id: string;
  type: 'is_landed' | 'age' | 'gold' | 'is_available' | string;
  operator: '=' | '>=' | '<=' | '>' | '<' | string;
  value: string;
}

interface ConditionBuilderProps {
  conditions: Condition[];
  onChange: (conditions: Condition[]) => void;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ 
  conditions, 
  onChange 
}) => {
  // 添加新条件
  const addCondition = () => {
    const newCondition: Condition = {
      id: Date.now().toString(),
      type: 'is_landed',
      operator: '=',
      value: 'yes'
    };
    onChange([...conditions, newCondition]);
  };

  // 更新条件
  const updateCondition = (index: number, field: keyof Condition, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    onChange(newConditions);
  };

  // 删除条件
  const deleteCondition = (index: number) => {
    const newConditions = conditions.filter((_, i) => i !== index);
    onChange(newConditions);
  };

  return (
    <Card title="条件构建器" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        {conditions.map((condition, index) => (
          <Card key={condition.id} size="small" style={{ background: '#fafafa' }}>
            <Space>
              <Select
                value={condition.type}
                onChange={(value) => updateCondition(index, 'type', value)}
                style={{ width: 120 }}
              >
                <Select.Option value="is_landed">is_landed</Select.Option>
                <Select.Option value="age">age</Select.Option>
                <Select.Option value="gold">gold</Select.Option>
                <Select.Option value="is_available">is_available</Select.Option>
                <Select.Option value="is_landed">is_landed</Select.Option>
                <Select.Option value="age">age</Select.Option>
                <Select.Option value="gold">gold</Select.Option>
                <Select.Option value="is_available">is_available</Select.Option>
                <Select.Option value="highest_held_title_tier">highest_held_title_tier</Select.Option>
                <Select.Option value="is_ai">is_ai</Select.Option>
                <Select.Option value="is_at_war">is_at_war</Select.Option>
                <Select.Option value="piety">piety</Select.Option>
                <Select.Option value="prestige">prestige</Select.Option>
              </Select>

              <Select
                value={condition.operator}
                onChange={(value) => updateCondition(index, 'operator', value)}
                style={{ width: 80 }}
              >
                <Select.Option value="=">=</Select.Option>
                <Select.Option value=">=">&gt;=</Select.Option>
                <Select.Option value="<=">&lt;=</Select.Option>
                <Select.Option value=">">&gt;</Select.Option>
                <Select.Option value="<">&lt;</Select.Option>
              </Select>

              <Input
                value={condition.value}
                onChange={(e) => updateCondition(index, 'value', e.target.value)}
                style={{ width: 100 }}
                placeholder="值"
              />

              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => deleteCondition(index)}
              />
            </Space>
          </Card>
        ))}

        <Button
          type="dashed"
          onClick={addCondition}
          icon={<PlusOutlined />}
          block
        >
          添加条件
        </Button>
      </Space>
    </Card>
  );
};

export default ConditionBuilder