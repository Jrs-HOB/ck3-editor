import React from 'react';
import { Card, Switch, Space, Typography } from 'antd';

const { Text } = Typography;

interface FieldConfig {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number';
  value: string;
  description: string;
  required: boolean;
  visible: boolean;
}

interface FieldVisibilityControlProps {
  fields: FieldConfig[];
  onChange: (fields: FieldConfig[]) => void;
}

const FieldVisibilityControl: React.FC<FieldVisibilityControlProps> = ({ 
  fields, 
  onChange 
}) => {
  // 切换字段可见性
  const toggleFieldVisibility = (fieldId: string) => {
    const newFields = fields.map(field => 
      field.id === fieldId ? { ...field, visible: !field.visible } : field
    );
    onChange(newFields);
  };

  return (
    <Card title="字段显示控制" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        {fields.map((field) => (
          <div key={field.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '8px',
            border: '1px solid #f0f0f0',
            borderRadius: '4px'
          }}>
            <div style={{ flex: 1 }}>
              <Text strong>{field.label}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {field.description}
              </Text>
            </div>
            <Switch
              checked={field.visible}
              onChange={() => toggleFieldVisibility(field.id)}
              size="small"
            />
          </div>
        ))}
      </Space>
    </Card>
  );
};

export default FieldVisibilityControl;