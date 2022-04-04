export default function connectToContext(WrappedComponent, select) {
    return function (props) {
        const selectors = select();
        return <WrappedComponent {...selectors} props={props} />;
    };
}
