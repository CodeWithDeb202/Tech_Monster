
import { useContext } from "react";
import AuthContext from "../../app/providers/Auth/AuthContext";

export default function useAuth() {
    return useContext(AuthContext);
}