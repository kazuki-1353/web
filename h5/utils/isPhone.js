let agents = [
  'android',
  'symbianos',
  'windows phone',
  'iphone',
  'ipad',
  'ipod',
];

/**判断是否为手机端 */
export default () => {
  if (!window) return false;

  let userAgent = window.navigator.userAgent.toLowerCase();

  let isPhone = agents.some((i) => {
    let include = userAgent.includes(i);
    return include;
  });

  return isPhone;
};
