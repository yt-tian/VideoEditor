
/**
 * 校验手机号码
 * @param {string} str 
 * @returns Boolean
 */
export function isPhoneNum(str) {
  return /^1[3|4|5|6|7|8|9]\d{9}$/.test(str);     
}