import { request, waitTime } from '@/utils/request';
import { ModalForm, ProFormInstance, ProFormUploadButton } from '@ant-design/pro-components';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';

interface InputDialogProps {
  // homeworkId
  id?: number;
  visible: boolean;
  onClose: (result: boolean) => void;
}

export default function InputDialog(props: InputDialogProps) {
  const form = useRef<ProFormInstance>(null);
  const [file, setFile] = useState<any>();
  useEffect(() => {
    waitTime().then(() => {
      form?.current?.resetFields();
    });
  }, [props.id, props.visible]);

  const onFinish = async (values: any) => {
    if (!props.id) return;
    const formData = new FormData();
    formData.append('file', file.originFileObj);
    formData.append('homeworkId', `${props.id}`);
    let result = await request('/api/userHomework/uploadFile', {
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
      layout="horizontal"
      modalProps={{
        destroyOnClose: true,
        onCancel: () => props.onClose(false),
      }}
      title="上传作业文件"
      open={props.visible}
    >
      <ProFormUploadButton
        label="文件"
        name="upload"
        max={1000}
        value={file ? [file] : []}
        rules={[
          {
            required: true,
            message: '请选择文件！',
          },
        ]}
        title="选择文件"
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
        extra={
          <div style={{ margin: 10 }}>
            已选择{file ? '1' : '0'}个文件{!!file && '：' + file.originFileObj?.name}
          </div>
        }
      />
    </ModalForm>
  );
}
