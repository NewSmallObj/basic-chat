import Toast from 'react-native-root-toast'
import { isDate,get } from "lodash"
import { BASE_URL } from './stants';
function formatRelativeTime(datetimeString: string | number | Date,now:Date): string {
    // const now = new Date();
    
    const targetDate = isDate(datetimeString) ? datetimeString :new Date(datetimeString);

    if (isNaN(targetDate.getTime())) {
        return '无效的时间格式';
    }

    const diff = now.getTime() - targetDate.getTime();

    const diffSeconds = Math.floor(diff / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) {
        return diffSeconds === 0 ? '刚刚' : `${diffSeconds}秒前`;
    } else if (diffMinutes < 60) {
        return `${diffMinutes}分钟前`;
    } else if (diffHours < 24) {
        return `${diffHours}小时前`;
    } else if (diffDays < 30) {
        return `${diffDays}天前`;
    } else {
        return `${Math.floor(diffDays / 30)}个月前`; // 进一步细化为月份
    }
}


const showToast = (message: string) => {
  Toast.show(message, {
    position: Toast.positions.CENTER,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0,
    duration: Toast.durations.LONG,
  })
}


const getAvatarUrl = (value:any)=>{
  if(typeof value === 'string') return BASE_URL + '/avatar/' +  value
  return get(value,'fileName',null) ? BASE_URL + '/avatar/' + get(value,'fileName',null) : undefined
}
export { formatRelativeTime,showToast,getAvatarUrl };


