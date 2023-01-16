import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { getAccount } from '../../redux/account/accountActions';

function GetAccountData() {

      const dispatch = useDispatch();
      const userId = useSelector((state) => state.user.user._id);

      useEffect(() => {
            if (userId)
                  dispatch(getAccount(userId));
      }, [userId])

      return (
            <></>
      )
}

export default GetAccountData