import { updateSelf } from '@/services/api/authentication';
import { ModalForm, ProFormGroup, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { message } from 'antd';
import { useRef } from 'react';

interface InputDialogProps {
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default (props: InputDialogProps) => {
  const form = useRef<ProFormInstance>(null);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const onFinish = async (values: any) => {
    try {
      await updateSelf(values, { throwError: true });
      message.success('修改个人信息成功');
      setInitialState({
        ...initialState,
        currentUser: {
          ...currentUser,
          phone: values.phone,
          email: values.email,
        },
      });
      props.onClose(true);
      return true;
    } catch (ex: any) {
      return false;
    }
  };

  return (
    <ModalForm
      width={600}
      onFinish={onFinish}
      formRef={form}
      grid={true}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title="个人设置"
      open={props.visible}
    >
      <ProFormGroup>
        <ProFormText
          name="oldPassword"
          label="账户旧密码"
          colProps={{ span: 12 }}
          placeholder="不改密码不用填写"
        />
        <ProFormText
          name="newPassword"
          label="新密码"
          colProps={{ span: 12 }}
          placeholder="不改密码不用填写"
        />
      </ProFormGroup>
      <ProFormText name="phone" label="手机号" initialValue={currentUser?.phone} />
      <ProFormText name="email" label="电子邮箱" initialValue={currentUser?.email} />
    </ModalForm>
  );
};
