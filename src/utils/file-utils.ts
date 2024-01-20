import { getSliceHash } from '@/services/api/uploadFile';
import { message } from 'antd';
import { request } from './request';

const sha1 = require('js-sha1');

function readChunk(file: File, sliceNumber: number, sliceSize: number) {
  return new Promise<ArrayBuffer>((resolve) => {
    const blob = file.slice(sliceNumber * sliceSize, sliceNumber * sliceSize + sliceSize);
    const reader = new FileReader();
    reader.onload = function ({ target }) {
      resolve(target?.result as ArrayBuffer);
    };

    //read file as ArrayBuffer
    reader.readAsArrayBuffer(blob);
  });
}

export async function getSha1(file: File, setHint?: (percent: number) => boolean) {
  const sliceSize = 1024 * 1024 * 5;
  const totalPages = Math.trunc((file.size + sliceSize - 1) / sliceSize);
  const hash = sha1.create();
  for (let i = 0; i < totalPages; i++) {
    const data = await readChunk(file, i, sliceSize);
    if (!data) break;
    hash.update(data);
    if (setHint && setHint(Math.ceil((i * 100) / totalPages))) {
      return undefined;
    }
  }

  return hash.hex();
}

export async function processUploadFile(
  file: File,
  uploadFile: API.UploadFileVO,
  setHint: (percent: number) => boolean,
) {
  const { sliceSize } = uploadFile;
  if (!sliceSize) {
    return false;
  }
  const totalPages = Math.trunc((file.size + sliceSize! - 1) / sliceSize!);
  for (let i = 0; i < totalPages; i++) {
    if (setHint(Math.ceil((i * 100) / totalPages))) {
      return false;
    }
    const hash = sha1.create();
    const data = await readChunk(file, i, sliceSize);
    hash.update(data);
    const thisSha1 = hash.hex();
    const sliceSha1 = await getSliceHash({ code: uploadFile.code!, sliceNumber: i });
    if (sliceSha1) {
      // 表示该片已经上传
      if (sliceSha1 !== thisSha1) {
        message.error('第' + i + '个数据片和服务器上的不一致');
        return false;
      }
      continue;
    }
    // 上传新的
    const formData = new FormData();
    formData.append('file', new Blob([data]));
    formData.append('code', uploadFile.code!);
    formData.append('sliceNumber', `${i}`);
    formData.append('sha1', thisSha1);
    const result = await request('/api/file/addSlice', {
      method: 'POST',
      requestType: 'form',
      data: formData,
    });
    if (!result) {
      return false;
    }
  }

  return true;
}
