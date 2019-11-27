/**
 * 转化缩写时间为日期对象
 * @param str // 数字[0-9]+单位[s|m|h|d] 不带单位默认按天处理  如：10s | 1d
 */
export const expiresDate = (str: string): Date | null => {
    let ms: number = 0;
    const reg: RegExp = /~([0-9]+)([smhd]?)$/;
    if (reg.test(str)) {
        const r: string[] = str.toString().match(reg) || [];
        const num: number = +r[1];
        const ext: string = r[2];
        switch (ext) {
            case 's':
                ms = num * 1000;
                break;
            case 'm':
                ms = num * 60 * 1000;
                break;
            case 'h':
                ms = num * 60 * 60 * 1000;
                break;
            case 'd':
            default:
                ms = num * 24 * 60 * 60 * 1000;
                break;
        }
    }
    return ms > 0 ? new Date(Date.now() + ms) : null;
};
export default expiresDate;
