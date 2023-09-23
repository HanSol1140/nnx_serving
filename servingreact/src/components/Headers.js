import { Link } from 'react-router-dom';
import './Headers.css';

const Headers = () => {
    return (
        <section id = "Headers">
            <ul>
                <Link to="/" className="link"><li>Main</li></Link>
                <Link to="/RobotSettings" className="link"><li>RobotSettings</li></Link>
                <Link to="/MovePointSettings" className="link"><li>MovePointSettings</li></Link>
            </ul>
        </section>
    );
};

export default Headers;