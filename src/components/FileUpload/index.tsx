import { addFile, finishSlice, getFile } from '@/services/api/uploadFile';
import { getSha1, processUploadFile } from '@/utils/file-utils';
import { formatValue } from '@/utils/string-utils';
import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Upload } from 'antd';
import { useRef, useState } from 'react';
const STATUS_UPLOADED = 2;
const STATUS_FINISHED = 3;
const SLICE_SIZE = 1024 * 1024 * 8;
interface FileUploadProps {
  onChange: (code?: string) => void;
}
export default (props: FileUploadProps) => {
  const [fileCode, setFileCode] = useState();
  const refStop = useRef(false);
  const [selectedFile, setSelectedFile] = useState<any>();
  const [hint, setHint] = useState('');
  const [running, setRunning] = useState(false);
  const handleUpload = async () => {
    refStop.current = false;
    if (!selectedFile) {
      message.warning('请先选择文件');
      return;
    }
    setRunning(true);
    const file: File = selectedFile.originFileObj;
    let code = fileCode;
    if (!code) {
      code = await getSha1(file, (percent) => {
        // 返回true将停止继续扫描
        setHint(`正在准备文件分片数据，已完成${percent}%`);
        return refStop.current;
      });
      setFileCode(code);
    }

    if (!code) {
      setHint('');
      message.error('扫描分片失败，可能用户取消了操作');
      setRunning(false);
      return;
    }

    let uploadFileVO = await getFile({ code });

    if (!uploadFileVO) {
      // 表示文件未上传过
      const result = await addFile({
        code,
        fullName: file.name,
        sliceSize: SLICE_SIZE,
        totalSize: file.size,
      });
      if (!result) {
        setRunning(false);
        return;
      }
      uploadFileVO = {
        code,
        sliceSize: SLICE_SIZE,
        fileSize: file.size,
      };
    } else if (uploadFileVO?.status === STATUS_FINISHED) {
      props.onChange(code);
      setRunning(false);
      return;
    } else if (uploadFileVO?.status === STATUS_UPLOADED) {
      message.success('文件已上传！正在等服务器校验');
      setHint('');
      props.onChange(code);
      setRunning(false);
      return;
    }

    const result = await processUploadFile(file, uploadFileVO, (percent) => {
      setHint(`正在上传分片数据，已完成${percent}%`);
      return refStop.current;
    });

    if (result) {
      if (await finishSlice({ code })) {
        setRunning(false);
        props.onChange(code);
        return;
      }
    }
    setRunning(false);
  };
  return (
    <div>
      <Upload
        listType="text"
        multiple={false}
        fileList={selectedFile ? [selectedFile] : undefined}
        showUploadList={false}
        customRequest={() => {}}
        accept="*"
        beforeUpload={(file) => {
          return new Promise((resolve, reject) => {
            const isLt4G = file.size / 1024 / 1024 / 1024 < 4;
            if (!isLt4G) {
              message.error('Image must smaller than 4GB!');
              reject(false);
            }
            resolve();
          });
        }}
        onChange={(info) => {
          const { file } = info;
          setFileCode(undefined);
          setHint('');
          setSelectedFile(file);
          props.onChange(undefined);
        }}
      >
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        icon={<UploadOutlined />}
        onClick={running ? () => (refStop.current = true) : handleUpload}
      >
        {running ? '停止' : '开始上传'}
      </Button>
      {!!selectedFile && (
        <div style={{ margin: 10 }}>
          文件名：{selectedFile.name}（{formatValue(selectedFile?.size)}）
        </div>
      )}
      {!selectedFile && <div style={{ margin: 10 }}>未选择文件</div>}
      <div>{hint}</div>
    </div>
  );
};
