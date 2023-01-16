 export const getPermission = (permissions) => {
   let permissionName = [];
   permissions?.forEach(item => {
      permissionName.push(item.name)
   });
   return permissionName;
}

