import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPermission, updateState } from "../../redux/permissions/permissionActions";
import { displayPermissionsModules } from '../../redux/permissionsModule/permissionsModuleActions';
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { toast } from 'react-toastify';

var permissionsModulesOptions = [];
const AddPermission = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const permissionsModules = useSelector(state => state.permissionsModule.permissionsModules);
  const [loader, setLoader] = useState(true);
  const [selectedPermissionModule, setSelectedPermissionModule] = useState(null);
  const success = useSelector((state) => state.permission?.success);
  const fetched = useSelector(state => state.permissionsModule.fetched);
  const error = useSelector((state) => state.permission.error);

  const { register, handleSubmit, reset, formState: { isSubmitSuccessful, errors } } = useForm();

  const addPerm = {
    name: {
      required: "Permission name is required",
      pattern: {
        value: /^[A-Za-z_]*$/,
        message: 'Please enter only alphabets and underscore',
      }
    }
  };

  const handleSave = (formData) => {
    if (selectedPermissionModule?.value) {
      setLoader(true);
      const data = { name: formData.name, permissionModule: selectedPermissionModule?.value };
      dispatch(addPermission(data));
    }
    else {
      toast.error('Permission module must be selected.');
    }
  };

  useEffect(() => {
    if (success) {
      setLoader(false);
      history.goBack();
    }
    if (isSubmitSuccessful) {
      reset({});
    }
    dispatch(updateState())
  }, [success]);

  useEffect(() => {
    if (error) {
      setLoader(false);
      dispatch(updateState())
    }
  }, [error])

  useEffect(() => {
    dispatch(displayPermissionsModules());
  }, []);

  useEffect(async () => {
    setLoader(true);
    permissionsModulesOptions = await permissionsModules?.map(mod => { return { value: mod._id, label: mod.name } });
    if (permissionsModulesOptions && permissionsModulesOptions.length > 0) {
      setSelectedPermissionModule(permissionsModulesOptions?.[0]);
    }
    if (fetched)
      setLoader(false);
  }, [permissionsModules, fetched]);

  const handlePermissionModuleChange = (selectedMod) => {
    setSelectedPermissionModule(selectedMod);
  }

  const colourStyles = {
    control: (styles, { isSelected }) => ({
      ...styles,
      background: '#374057',
      color: '#fff',
      border: '1px solid #374057',
      boxShadow: isSelected ? "none" : "none",
      borderColor: isSelected ? "#374057" : "#374057",
      "&:hover": {
        boxShadow: 'none',
      },
    }),
    input: styles => ({
      ...styles,
      color: '#fff',
    }),
    singleValue: styles => ({
      ...styles,
      color: '#fff',
    }),
    menuList: styles => ({
      ...styles,
      background: '#374057',
    }),
    option: (styles, { isFocused, isSelected }) => ({
      ...styles,
      background: isFocused
        ? '#16202e'
        : isSelected
          ? '#16202e'
          : undefined,
      color: "#fff",
      cursor: 'pointer',
      zIndex: 1,
      "&:hover": {
        background: "#16202e",
      }
    }),
  }

  return (
    <>
      {loader ? (<FullPageTransparentLoader />) :
        (
          <>
            <div className="content-wrapper right-content-wrapper">
              <div className="content-box">
                <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                <h3>Add Permission</h3>
                <form onSubmit={handleSubmit(handleSave)}>
                  <div className="form-group col-md-12">
                    <label className="control-label">Select Permission Module</label>
                    <Select
                      value={selectedPermissionModule}
                      onChange={handlePermissionModuleChange}
                      options={permissionsModulesOptions}
                      styles={colourStyles}
                    />
                  </div>
                  <div className="form-group col-md-12">
                    <label className="control-label">Permission Name</label>
                    <input type="text" className="form-control" placeholder="e.g permission_name"
                      {...register('name', addPerm.name)} name='name' />
                    {errors?.name && <span className="errMsg">{errors.name.message}</span>}
                  </div>
                  <div>
                    <button className="btn-default btn" type="submit">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
    </>
  );
};

export default AddPermission;
