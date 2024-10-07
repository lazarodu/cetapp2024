import React, {
    createContext,
    useCallback,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { apiUser } from "../services/data";
import { api } from "../services/api";
import { IAuthState, IAuthContextData, IAuthenticate } from "../interfaces/User.interface";
import AsyncStorage from "@react-native-async-storage/async-storage";
export interface IProvider {
    children: ReactNode
}
const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

const AuthProvider = ({ children }: IProvider) => {
    const [auth, setAuth] = useState<IAuthState>({} as IAuthState);

    const signIn = useCallback(async ({ email, password }: IAuthenticate): Promise<boolean> => {
        const response = await apiUser.login({
            email,
            password,
        });
        const { access_token, user } = response.data.data;
        api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
        setAuth({ access_token, user });

        await AsyncStorage.setItem("access_token", access_token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        return Boolean(response.data.data.user.comissao)
    }, []);

    const signOut = useCallback(async () => {
        setAuth({} as IAuthState);
        await AsyncStorage.removeItem("access_token");
        await AsyncStorage.removeItem("user");
        delete api.defaults.headers.common.authorization;
        await apiUser.logout();
    }, []);

    useEffect(() => {
        const loadUserStorageData = async () => {
            const access_token = await AsyncStorage.getItem("access_token");
            const user = await AsyncStorage.getItem("user");

            if (access_token && user) {
                api.defaults.headers.common.Authorization = `Bearer ${access_token}`;
                setAuth({ access_token, user: JSON.parse(user) });
            } else {
                setAuth({} as IAuthState);
                await AsyncStorage.removeItem("access_token");
                await AsyncStorage.removeItem("user");
                delete api.defaults.headers.common.authorization;
            }
        };
        loadUserStorageData()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                signIn,
                signOut,
                access_token: auth?.access_token,
                user: auth?.user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export { AuthProvider, AuthContext };
