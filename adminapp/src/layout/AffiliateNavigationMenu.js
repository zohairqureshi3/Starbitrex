import { useParams, NavLink } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const AffiliateNavigationMenu = (props) => {
    const history = useHistory();
    let { id } = useParams();
    const [path, setPath] = useState('/');

    const [activeSidebar, setActiveSidebar] = useState(true);
    const activeTab = (path) => {
        setPath(path)
        history.push(path)
    }

    useEffect(() => {
        const pathname = window.location.pathname;
        setPath(pathname)
    }, []);

    const checkScreen = () => {
        if (window.innerWidth < 768 === true) {
            setActiveSidebar(false);
        } else {
            setActiveSidebar(true);
        }
    }

    useEffect(() => {
        checkScreen();
    }, []);
    const showSidebar = () => {
        setActiveSidebar(!activeSidebar);
    }

    return (
        <>
            {
                activeSidebar ?
                    <><div className='sidebar-is-active'></div></> :
                    <></>
            }
            <div className={activeSidebar ? "sidebar left-sidebar-fix show-sidenav" : "sidebar left-sidebar-fix hide-sidenav"}>
                <div style={{ position: "relative" }}>
                    <div className="profile pt-0">
                        <div className="profile-info">
                            <h5>Affiliate Panel</h5>
                        </div>
                    </div>
                </div>
                <div className='admin-panel-btns'>
                    <nav className='w-100'>
                        <NavLink to={`/admin/aff/user-detail/${id}`} className="active admin-nav-link sub-menu-padding">
                            User Detail
                        </NavLink>
                    </nav>
                </div>
            </div>
        </>
    )
}
export default AffiliateNavigationMenu