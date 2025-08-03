import {Provider} from "react-redux";
import {store} from "./stores/store.js";
import {AppRoutes} from "./AppRoutes.jsx";

export const App = () => {
    return (
        <Provider store={store}>
            <AppRoutes/>
        </Provider>
    )
}
