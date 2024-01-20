//新建
import { ModalForm, ProForm, ProFormInstance, ProFormText, ProFormDigit, ProFormTextArea, } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
import { waitTime } from '@/utils/request';
import { addLab, updateLab } from '@/services/api/lab';

interface InputDialogProps {
  detailData?: API.LabVO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);

  useEffect(() => {
    waitTime().then(() => {
      if (props.detailData) {
        form?.current?.setFieldsValue(props.detailData);
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.detailData, props.visible]);

  const onFinish = async (values: any) => {
    const { name, address, description, capacity, area } = values;
    const data: API.LabDTO = {
      id: props.detailData?.id,
      name,
      address,
      description,
      capacity,
      area,
    };
    let result;
    if (props.detailData) {
      result = await updateLab(data);
    } else {
      result = await addLab(data);
    }
    if (result !== undefined ) {
      props.onClose(true);
      message.success('保存成功');
      return true;
    } else {
      return false;
    }
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.detailData ? '修改实验室信息' : '新建实验室'}
      open={props.visible}
    >
      <ProFormText
        name="name"
        label="实验室名称"
        rules={[
          {
            required: true,
            message: '请提供实验室名称',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormText
          name="address"
          label="实验室地址"
          rules={[
            {
              required: true,
              message: '请提供实验室地址',
            },
          ]}
        />
        <ProFormDigit
          name="capacity"
          label="实验室最大容纳人数"
          rules={[
            {
              required: true,
              message: '请提供实验室最大容纳人数!',
            },
            {
              type: 'number',
              min: 1,
              max: 300,
              message: '请输入有效的实验室最大容纳人数',
            },
          ]}
        />
        <ProFormDigit
          name="area"
          label="实验室面积（平方米）"
          rules={[
            {
              required: true,
              message: '请提供实验室面积!',
            },
            {
              type: 'number',
              min: 1,
              max: 500,
              message: '请输入有效的实验室面积',
            },
          ]}
        />
      </ProForm.Group>

      <ProFormTextArea name="description" label="实验室设施详情" />
    </ModalForm>
  );
}
