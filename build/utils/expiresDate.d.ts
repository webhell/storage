/**
 * 转化缩写时间为日期对象
 * @param str // 数字[0-9]+单位[s|m|h|d] 不带单位默认按天处理  如：10s | 1d
 */
export declare const expiresDate: (str: string) => Date | null;
export default expiresDate;
