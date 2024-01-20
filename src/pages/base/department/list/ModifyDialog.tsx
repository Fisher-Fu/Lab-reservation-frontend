import { updateDepartment } from '@/services/api/department';
import { waitTime } from '@/utils/request';
import { ModalForm, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';

interface InputDialogProps {
  detailData?: API.DepartmentDTO;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default (props: InputDialogProps) => {
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
    if (!props.detailData) return;
    const { departmentName, description, contact, contactPhone } = values;
    const data: API.DepartmentDTO = {
      id: props.detailData?.id,
      contact,
      departmentName,
      contactPhone,
      description,
    };

    try {
      await updateDepartment(data, { throwError: true });
    } catch (ex) {
      return true;
    }

    props.onClose(true);
    message.success('保存成功');
    return true;
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
      title={props.detailData ? '修改部门' : '新建部门'}
      open={props.visible}
    >
      <ProFormText
        name="departmentName"
        label="班级名称"
        rules={[
          {
            required: true,
            message: '请输入班级名称！',
          },
        ]}
      />
      <ProForm.Group>
        <ProFormText name="contact" label="课代表" />
        <ProFormText name="contactPhone" label="课代表电话" />
      </ProForm.Group>
      <ProFormText name="description" label="备注" />
    </ModalForm>
  );
};
