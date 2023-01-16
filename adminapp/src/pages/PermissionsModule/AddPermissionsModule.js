import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPermissionsModule, updateState } from "../../redux/permissionsModule/permissionsModuleActions";
import FullPageTransparentLoader from "../FullPageTransparentLoader/fullPageTransparentLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from 'react-router-dom';
import { useForm } from "react-hook-form";

const AddPermissionsModule = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const success = useSelector((state) => state.permissionsModule?.success);
  const error = useSelector((state) => state.permissionsModule?.error);

  const { register, handleSubmit, reset, formState: { isSubmitSuccessful, errors } } = useForm();

  const addPerm = {
    name: {
      required: "Permissions Module name is required",
      pattern: {
        value: /^[A-Za-z_]*$/,
        message: 'Please enter only alphabets and underscore',
      }
    }
  };

  const handleSave = (formData) => {
    setLoader(true);
    const data = { name: formData.name };
    dispatch(addPermissionsModule(data));
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

  return (
    <>
      {loader ? (<FullPageTransparentLoader />) :
        (
          <>
            <div className="content-wrapper right-content-wrapper">
              <div className="content-box">
                <FontAwesomeIcon className="faArrowLeftIcon" icon={faArrowLeft} onClick={() => history.goBack()} />
                <h3>Add Permissions Module</h3>
                <form onSubmit={handleSubmit(handleSave)}>
                  <div className="form-group col-md-12">
                    <label className="control-label">Permissions Module Name</label>
                    <input type="text" className="form-control" placeholder="Enter Permission name"
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

export default AddPermissionsModule;
