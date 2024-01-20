import { addDepartmentUser } from '@/services/api/department';
import { waitTime } from '@/utils/request';
import { ModalForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef } from 'react';
interface InputDialogProps {
  departmentId: number;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default (props: InputDialogProps) => {
  const form = useRef<ProFormInstance>(null);

  useEffect(() => {
    waitTime().then(() => {
      form?.current?.resetFields();
    });
  }, [props.departmentId, props.visible]);

  const onFinish = async (values: any) => {
    const { userCode, name } = values;
    const result = await addDepartmentUser({ userCode, name, departmentId: props.departmentId });
    if (result) {
      message.success('添加成功');
      props.onClose(true);
    }
    return true;
  };

  return (
    <ModalForm
      width={500}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title="添加学生到班级"
      open={props.visible}
    >
      <ProFormText name="userCode" label="学号" rules={[{ required: true }]} />
      <ProFormText name="name" label="姓名" rules={[{ required: true }]} />
    </ModalForm>
  );
};
