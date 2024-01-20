import { request, waitTime } from '@/utils/request';
import {
  ModalForm,
  ProFormGroup,
  ProFormInstance,
  ProFormText,
  ProFormUploadButton,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface InputDialogProps {
  id?: number;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default (props: InputDialogProps) => {
  const form = useRef<ProFormInstance>(null);
  const [file, setFile] = useState<any>();

  useEffect(() => {
    waitTime().then(() => {
      if (props.id) {
        form?.current?.setFieldsValue({});
      } else {
        form?.current?.resetFields();
      }
    });
  }, [props.id, props.visible]);

  const onFinish = async (values: any) => {
    if (!file) {
      message.error('请选择文件');
      return;
    }
    const { departmentName, contact, contactPhone, description } = values;
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    formData.append('departmentName', departmentName || '');
    formData.append('contact', contact || '');
    formData.append('contactPhone', contactPhone || '');
    formData.append('description', description || '');
    let result = await request('/api/department/importDepartment', {
      method: 'POST',
      requestType: 'form',
      data: formData,
    });

    if (result) {
      message.success('导入成功');
      props.onClose(true);
      return true;
    }

    return false;
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        okText: '保存',
        onCancel: () => props.onClose(false),
      }}
      title={'导入班级'}
      open={props.visible}
    >
      <ProFormGroup>
        <ProFormText
          name="departmentName"
          label="班级名称"
          width="lg"
          rules={[{ required: true }]}
        />
        <ProFormText name="contact" label="课代表" />
        <ProFormText name="contactPhone" label="课代表手机号" />
        <ProFormText name="description" label="备注" width="lg" />
        <ProFormUploadButton
          label="花名册"
          name="upload"
          max={1000}
          value={file ? [file] : []}
          rules={[
            {
              required: true,
              message: '请选择文件！',
            },
          ]}
          title="选择Excel文件"
          fieldProps={{
            name: 'file',
            multiple: false,
            directory: false,
            showUploadList: false,
            beforeUpload: () => setFile([]),
            customRequest: () => {},
          }}
          onChange={(info) => {
            const { file } = info;
            setFile(file);
          }}
          extra={<div style={{ margin: 10 }}>已选择{file ? '1' : '0'}个文件</div>}
        />
      </ProFormGroup>
    </ModalForm>
  );
};
