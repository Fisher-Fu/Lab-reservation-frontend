// @ts-ignore
/* eslint-disable */
import { request } from '@/utils/request';

/** 此处后端没有提供注释 POST /api/courseSchedule/addCourseSchedule */
export async function addCourseSchedule(
  body: API.CourseScheduleDTO,
  options?: { [key: string]: any },
) {
  return request<number>('/api/courseSchedule/addCourseSchedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/courseSchedule/cancelCourseSchedule */
export async function cancelCourseSchedule(
  body: API.ScheduleVerifyDTO,
  options?: { [key: string]: any },
) {
  return request<any>('/api/courseSchedule/cancelCourseSchedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/courseSchedule/deleteCourseSchedule */
export async function deleteCourseSchedule(body: number[], options?: { [key: string]: any }) {
  return request<number>('/api/courseSchedule/deleteCourseSchedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/courseSchedule/getSchedule */
export async function getSchedule(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getScheduleParams,
  options?: { [key: string]: any },
) {
  return request<API.CourseScheduleVO>('/api/courseSchedule/getSchedule', {
    method: 'POST',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/courseSchedule/listCourseSchedule */
export async function listCourseSchedule(
  body: API.CourseScheduleQueryDTO,
  options?: { [key: string]: any },
) {
  return request<API.PageCourseScheduleVO>('/api/courseSchedule/listCourseSchedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 POST /api/courseSchedule/updateCourseSchedule */
export async function updateCourseSchedule(
  body: API.CourseScheduleDTO,
  options?: { [key: string]: any },
) {
  return request<any>('/api/courseSchedule/updateCourseSchedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
