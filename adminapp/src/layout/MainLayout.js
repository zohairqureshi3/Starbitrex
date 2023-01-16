import Header from './Header'
import NavigationMenu from './NavigationMenu'


const MainLayout = ({ children }) => {

    return (
        <>
            <Header />
            <div className="dashboard-wrapper main-padding">
                <div className="row">
                    <NavigationMenu />
                    {children}
                </div>
            </div>
        </>
    )
}

export default MainLayout