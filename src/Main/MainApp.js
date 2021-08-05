import App from '../Pages/index';
import { Container, Spinner } from 'react-bootstrap';
import { BaseColor } from '../config/index';
import LoadingOverlay from 'react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'
import { useSelector } from 'react-redux';

function MainApp(props) {
    let { match } = props;
    var auth = useSelector(({ auth }) => auth);
    console.log('match mainapp', match);

    return (
        <LoadingOverlay
        // auth && auth.loading || false
            active={auth && auth.loading || false}
            spinner={<Spinner animation="grow" variant="primary" size="lg" />}
            styles={{
                overlay: (base) => ({
                    ...base,
                    background: 'rgba(0, 0, 0, 0.3)'
                })
            }}
        // spinner={<BounceLoader />}
        >
            <div style={{ backgroundColor: BaseColor.lightGrayColor }}>
                <App match={match} location={props.location} />
            </div>
        </LoadingOverlay>
    )
}
export default MainApp;