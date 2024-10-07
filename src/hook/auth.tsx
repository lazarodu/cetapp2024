import { useContext } from "react"
import { AuthContext } from "../context/auth"
import { IAuthContextData } from "../interfaces/User.interface"

export function useAuth(): IAuthContextData {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser utilizado com o AuthProvider')
    }
    return context
}
