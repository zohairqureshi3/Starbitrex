import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect } from "react-multi-select-component";
import { getRole, editRole } from '../../redux/roles/roleActions';
import { displayPermissions } from "../../redux/permissions/permissionActions";
import { displayModulesWithPermissions } from '../../redux/permissionsModule/permissionsModuleActions';
import { useParams, useHistory } from 'react-router-dom';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const EditRole = () => {

   let { id } = useParams();
   const [loader, setLoader] = useState(false);
   const dispatch = useDispatch();
   const roleData = useSelector(state => state.role?.editRole);
   const allPermissions = useSelector(state => state.role?.allPermissions);
   const modulesWithPermissions = useSelector((state) => state.permissionsModule?.modulesWithPermissions);
   const [selectedPermissions, setSelectedPermissions] = useState([]);
   const [selectedPermissionModule, setSelectedPermissionModule] = useState([]);
   const [role, setRole] = useState("");
   const [options, setOptions] = useState([]);
   const [selectedItems, setSelected] = useState([]);
   const [roleErr, setRoleErr] = useState("");
   const [permissionErr, setPermissionErr] = useState("");
   const history = useHistory();

   useEffect(() => {
      dispatch(displayModulesWithPermissions());
      dispatch(getRole(id));
   }, []);

   useEffect(() => {
      if (roleData && roleData.length > 0 && roleData[0].permissions && roleData[0].permissions.length > 0) {
         let tempRoles = []

         roleData[0].permissions.forEach(item => {

            tempRoles.push({
               "value": item._id,
               "label": item.name,
            })
         })

         setSelected(tempRoles)
      }
   }, [roleData]);

   const getRoleData = async () => {
      let roleName = roleData[0]?.name;
      setRole(roleName);

      const optionsValue = allPermissions.map((permission) => ({
         "value": permission._id,
         "label": permission.name
      }));
      setOptions(optionsValue);
   }

   useEffect(async () => {
      let modperms = [...selectedPermissionModule];
      let perms = roleData?.[0]?.permissions?.map(permission => permission._id);
      let isModChecked;
      if (perms?.length > 0) {
         await modulesWithPermissions?.forEach(modWithPerm => {
            isModChecked = modWithPerm?.permissions?.every(res => perms?.includes(res._id))
            if (isModChecked) {
               if (modperms.indexOf(modWithPerm._id) == -1) {
                  modperms.push(modWithPerm._id)
               }
            }
         })
      }

      setSelectedPermissionModule([...modperms]);
      setSelectedPermissions(perms);
   }, [roleData, modulesWithPermissions]);

   const handleSubmit = (e) => {
      e.preventDefault();
      const exp = /^[a-z A-Z_]+$/;
      if (!role) {
         setRoleErr("Role name is required");
      } else if (!role.match(exp)) {
         setRoleErr("Only Alphabets are allowed");
      }
      else {
         setLoader(true);
         let tempIds = [];
         selectedItems.forEach(item => {
            tempIds.push(item.value)
         });
         const data = {
            name: role,
            permissionIds: selectedPermissions,
            id: id
         }
         dispatch(editRole(data));
         setRole("");
         setRoleErr("");
         setPermissionErr("");
         history.goBack();
      }
   }

   useEffect(() => {
      getRoleData();
   }, [roleData]);

   const handleModWithPermChange = async (event, mod) => {
      let perms = [...selectedPermissions];
      let modperms = [...selectedPermissionModule];

      if (event.target.checked) {
         if (modperms.indexOf(mod._id) == -1) {
            await modperms.push(mod._id)
         }
         mod?.permissions?.forEach(async (elem) => {
            if (perms.indexOf(elem._id) == -1) {
               await perms.push(elem._id)
            }
         })
      }
      else {
         const modpermIndex = await modperms.indexOf(mod._id);
         if (modpermIndex > -1) {
            await modperms.splice(modpermIndex, 1);
         }

         let removeValFromIndex = await mod?.permissions?.map(perm => perms.indexOf(perm._id));
         for (var i = removeValFromIndex.length - 1; i >= 0; i--)
            perms.splice(removeValFromIndex[i], 1);
      }
      setSelectedPermissionModule([...modperms]);
      setSelectedPermissions([...perms]);
   }

   const handlePermissionsChange = async (event, perm, mod) => {
      let perms = [...selectedPermissions];
      let modperms = [...selectedPermissionModule];

      if (event.target.checked) {
         if (perms.indexOf(perm._id) == -1) {
            await perms.push(perm._id)
         }
      }
      else {
         const permIndex = await perms.indexOf(perm._id);
         if (permIndex > -1) {
            await perms.splice(permIndex, 1);
         }
      }

      let isModChecked = mod?.permissions?.every(res => perms.includes(res._id))
      if (isModChecked) {
         if (modperms.indexOf(mod._id) == -1) {
            await modperms.push(mod._id)
         }
      }
      else {
         const modpermIndex = await modperms.indexOf(mod._id);
         if (modpermIndex > -1) {
            await modperms.splice(modpermIndex, 1);
         }
      }

      setSelectedPermissionModule([...modperms]);
      setSelectedPermissions([...perms]);
   }

   return (
      <>
         {loader ? <FullPageTransparentLoader /> :
            <>
               <div className="content-wrapper right-content-wrapper">
                  <div className="content-box">
                     <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                     <h3>Edit Role</h3>
                     <form>
                        <div className="form-group col-md-12">
                           <label className="control-label">Role</label>
                           <input type="text" required="required" className="form-control" name="role" value={role || ""}
                              placeholder="Enter role" onChange={(e) => {
                                 if (e.target.value) {
                                    setRole(e.target.value)
                                    setRoleErr("")
                                 } else {
                                    setRole(e.target.value)
                                    setRoleErr("Role name is required")
                                 }
                              }} />
                           {roleErr ? (<span className="errMsg">{roleErr}</span>) : ("")}
                        </div>
                        <div className="form-group col-md-12 pt-2">
                           <h5>Edit Permissions</h5>
                           <div className="add-permissions-container">
                              <div className="row">
                                 {modulesWithPermissions?.length > 0 ? modulesWithPermissions?.map(modWithPerm => <div key={modWithPerm?._id} className="col-md-6">
                                    <div className="checkboxes-wrapper">
                                       <h6 className="d-flex align-items-center"><input type="checkbox" className="me-2" checked={selectedPermissionModule?.includes(modWithPerm?._id) || false} onChange={(e) => handleModWithPermChange(e, modWithPerm)} /> {modWithPerm.name}</h6>
                                       <div className="child-checkboxes">
                                          {modWithPerm?.permissions?.length > 0 &&
                                             modWithPerm?.permissions?.map(perm => <>
                                                <p key={perm?._id} className="text-white d-flex align-items-center mb-0"><input type="checkbox" className="me-1" checked={selectedPermissions?.includes(perm?._id) || false} onChange={(e) => handlePermissionsChange(e, perm, modWithPerm)} />{perm?.name}</p>
                                             </>)
                                          }
                                       </div>
                                    </div>
                                 </div>) : null}
                              </div>
                           </div>
                        </div>
                        <div>
                           <button type='button' className="btn-default btn" onClick={(e) => { handleSubmit(e) }}>Save</button>
                        </div>
                     </form>
                  </div>
               </div>
            </>
         }
      </>
   )
}

export default EditRole