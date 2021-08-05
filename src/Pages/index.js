import { Switch, Route } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Home from './Home';
import NotFound from './NotFound';
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
        ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
}

const App = ({ match, location }) => {
    const prevLocation = usePrevious(location);
    var auth = useSelector(({ auth }) => auth);
    // console.log(auth, auth.user, auth.user === null, "MainAuth");
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        if (prevLocation) {
            if (location.pathname !== prevLocation.pathname) {
                // console.log('**scroll**')
                window.scrollTo(0, 0);
            }
        }
    }, [location])

    return (
        <Switch>
            <Route exact path={`${match.url}`} component={Home} title="Home" />
            <Route path={`${match.url}home`} component={Home} />
            <Route component={NotFound} />
        </Switch>
    )
}
export default App;