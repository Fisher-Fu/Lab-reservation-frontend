/*
 * @文件描述:
 * @公司: redlib
 * @作者: 李洪文
 * @Date: 2020-04-07 14:34:01
 * @LastEditors: 李洪文
 * @LastEditTime: 2020-05-25 17:05:35
 */

export const formatFlow = (value: number) => {
  if (typeof value === 'undefined') {
    return;
  }
  return formatValue(value) + 'B';
};

export const formatValue = (value: number) => {
  if (typeof value === 'undefined') {
    return;
  }

  if (value < 1024) {
    return `${value}`;
  }
  let unit = '';
  if (value < 1024 * 1024) {
    value = value / 1024;
    unit = 'K';
  } else if (value < 1024 * 1024 * 1024) {
    value = value / 1024 / 1024;
    unit = 'M';
  } else {
    value = value / 1024 / 1024 / 1024;
    unit = 'G';
  }
  return value.toFixed(1) + unit;
};

export const formatValueObject = (value: number) => {
  if (value < 1024) {
    return { value, unit: '' };
  }
  let unit = '';
  if (value < 1024 * 1024) {
    value = value / 1024;
    unit = 'K';
  } else if (value < 1024 * 1024 * 1024) {
    value = value / 1024 / 1024;
    unit = 'M';
  } else {
    value = value / 1024 / 1024 / 1024;
    unit = 'G';
  }
  return {
    value: value.toFixed(2),
    unit,
  };
};

export const makeQuery = (queryObject: { [key: string]: any }) => {
  const array: string[] = [];
  return Object.entries(queryObject)
    .reduce((result, entry) => {
      result.push(entry.join('='));
      return result;
    }, array)
    .join('&');
};

export function renderHint(name: string, value: string) {
  return `
      <div style="margin: 0px 0 0;line-height:1;">
        <div style="font-size:14px;color:#666;font-weight:400;line-height:1;">
          ${name}
        </div>
        <div style="margin: 10px 0 0;line-height:1;">
          <div style="margin: 0px 0 0;line-height:1;">
            <div style="margin: 0px 0 0;line-height:1;">
              <span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#FFA989;"></span>
              <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">
                总量
              </span>
              <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">
                ${value}
              </span>
              <div style="clear:both"></div>
            </div>
            <div style="clear:both"></div>
          </div>
          <div style="clear:both"></div>
        </div>
        <div style="clear:both"></div>
      </div>
      `;
}
