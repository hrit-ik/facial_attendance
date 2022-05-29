import Cookies from 'js-cookie';
import Logoutfunc from '../../utils/logout';

const Logout = () => {
    Logoutfunc();
    return (
        <div>
        <p>You have been logged out.</p>
        </div>
    )
}

export default Logout;