/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
  const { currentUser } = initialState ?? {};
  const { privSet = [], userCode, userId, adminId } = currentUser || {};
  return {
    hasPrivilege: (route: any) => {
      let { name } = route;

      if (userId) {
        return name === 'userHomework' || name === 'userHomeworkView';
      } else {
        if (name === 'userHomework') return false;
      }

      if (name === 'homeworkView') name = 'homework';
      if (name === 'deptStudent') name = 'department';
      if (name === 'scheduleVerifyDetail') name = 'scheduleVerify';

      if (!userId) return 'root' === userCode || privSet.includes(name + '.page');
    },
  };
}
