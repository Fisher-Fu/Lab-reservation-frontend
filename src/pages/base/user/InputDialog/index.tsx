import { addUser, getUser, updateUser } from '@/services/api/user';
import { waitTime } from '@/utils/request';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormGroup,
  ProFormInstance,
  ProFormRadio,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';
interface InputDialogProps {
  id?: number;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);
  const [user, setUser] = useState<API.UserDTO>();
  const [local, setLocal] = useState(true);

  useEffect(() => {
    if (!props.id) {
      setUser(undefined);
      setLocal(true);
      form?.current?.resetFields();
      return;
    }
    try {
      getUser({ id: props.id }).then((result) => {
        setUser(result);
        if (!result) {
          setLocal(true);
          form?.current?.resetFields();
          return;
        }
        setLocal(!!result.local);
        waitTime().then(() => {
          form?.current?.setFieldsValue(result);
        });
      });
    } catch {}
  }, [props.id, props.visible]);

  const onFinish = async (values: any) => {
    const { redirectUris, ...rest } = values;
    const uris = (redirectUris as string)?.split('\n');
    let result;
    if (props.id) {
      result = await updateUser({ ...rest, id: props.id, redirectUris: uris });
    } else {
      result = await addUser({ ...rest, redirectUris: uris });
    }
    if (result) {
      message.success('保存成功');
      props.onClose(true);
    }
    return true;
  };

  return (
    <ModalForm
      width={800}
      grid={true}
      onFinish={onFinish}
      formRef={form}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title={props.id ? '修改学生' : '新建学生'}
      open={props.visible}
    >
      <ProFormGroup>
        <ProFormText name="userCode" label="学号" disabled={!!props?.id} colProps={{ span: 8 }} />
        <ProFormText name="name" label="姓名" colProps={{ span: 8 }} rules={[{ required: true }]} />
        <ProFormRadio.Group
          name="sex"
          colProps={{ span: 8 }}
          label="性别"
          options={[
            {
              label: '男',
              value: 1,
            },
            {
              label: '女',
              value: 0,
            },
          ]}
        />

        <ProFormText name="phone" label="手机号" colProps={{ span: 8 }} />
        <ProFormText name="email" label="电子邮箱" colProps={{ span: 8 }} />
        <ProFormText name="identityNumber" label="身份证号" colProps={{ span: 8 }} />

        <ProFormText name="department" label="班级" colProps={{ span: 8 }} />
        <ProFormDatePicker
          name="expiredAt"
          label="过期时间"
          colProps={{ span: 8 }}
          rules={[{ required: true }]}
        />
        <ProFormSwitch name="enabled" label="账户可用" colProps={{ span: 8 }} initialValue={true} />
        <ProFormText name="description" label="描述" colProps={{ span: 8 }} />
      </ProFormGroup>
    </ModalForm>
  );
}
