// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/scheduleVerify/verify */
export async function scheduleVerify(
  body: API.ScheduleVerifyDTO,
  options?: { [key: string]: any },
) {
  return request<number>('/api/scheduleVerify/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
