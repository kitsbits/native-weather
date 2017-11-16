import axios from "axios";

const authUrl = "https://localhost:7000/auth/";
const weatherUrl = "https://localhost:7000/weather";

const LOGON = "LOGON";
const HANDLE_AUTH_ERR = "HANDLE_AUTH_ERR";
const LOGOUT = "LOGOUT";

//HELPER FUNCTIONS
const logon = (success, user) => {
    return {
        type: LOGON,
        success,
        user
    };
};

const HANDLE_AUTH_ERR = (key, errCode) => {
    return {
        type: HANDLE_AUTH_ERR,
        key,
        errCode
    };
};

//ACTIONS
export const signup = (creds, history) => {
    return dispatch => {
        axios
            .post(authUrl + "signup/", creds)
            .then(response => {
                let { token, user, success } = response.data;
                localStorage.setItem("token", token);
                dispatch(logon(success, user));
                history.push("/profile");
            })
            .catch(err => {
                dispatch(HANDLE_AUTH_ERR("signup", err.response.status));
            });
    };
};

export const signin = (creds, history) => {
    return dispatch => {
        axios
            .post(authUrl + "login/", creds)
            .then(response => {
                let { token, user, success } = response.data;
                dispatch(logon(success, user));
                history.push("/profile");
            })
            .catch(err => {
                dispatch(HANDLE_AUTH_ERR("signin", err.response.status));
            });
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    return {
        type: LOGOUT
    };
};

export const verify = (history, pathname) => {
    return disptach => {
        axios
            .get(authUrl + "verify")
            .then(response => {
                let { success, user } = response.data;
                dispatch(logon(success, user));
                history.push(pathname);
            })
            .catch(err => {
                console.error(err);
            });
    };
};

// export const loadWeather = () => {
//     return dispatch => {
//         axios.get()
//     }
// }

export const userActions = {
    signin,
    signup,
    logout,
    verify,
    //add other actions after creating
}

//REDUCERS
let defaultState = {
    location: {
        longitude: "",
        latitude: ""
    },
    user: {
        firstName: "",
        username: "",
        password: "",
        defaultLocation: {},
        locations: []
    }
};


const userReducer = (state = defaultState, action) => {
    switch(action.type) {
        case: "SIGNIN":
            return {
                ...state,
                authErrCode: {
                    signup: "",
                    signin: ""
                },
                user: action.user,
                isAuthenticated: action.success
            };
        case: "HANDLE_AUTH_ERR":
            return {
                ...state,
                authErrCode: {
                    ...state.authErrCode,
                    [action.key]: action.errCode
                }
            };

    };

}
