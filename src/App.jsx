import {Provider} from "react-redux";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {store} from "./stores/store.js";
import {AppRoutes} from "./AppRoutes.jsx";

const theme = createTheme({
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
    },
});

export const App = () => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <AppRoutes/>
            </ThemeProvider>
        </Provider>
    )
}
