// 权限 判断
let authorities = window.localStorage.getItem ('authorities');
authorities = JSON.parse (authorities);
const Authorities = permissionMark => {
  if (authorities && authorities.length > 0) {
    let pessionStatus = false;
    for (let i = 0; i < authorities.length; i++) {
      if (permissionMark == authorities[i].authority) {
        pessionStatus = true;
        break;
      }
    }
    return pessionStatus;
  } else {
    return false;
  }
};
export {Authorities};
