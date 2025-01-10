import { createContext, useEffect, useState } from "react";
import { getCurrentUSer } from "../lib/action/userAction";
import useBankAccounts from "../lib/hooks/banksFetctHook";
import { globalContextProps, User } from "../types/type";

type globalProviderProps = {
    children: React.ReactNode;
}

export const GlobalContext = createContext<globalContextProps | null>(null);



const GlobalProvider = ({ children } : globalProviderProps) => {

    const [isLoggedIn, setIsLoggedIn ] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const {accounts, loading: bankLoading} = useBankAccounts({user ,isLoggedIn});

    useEffect(() => {
        getCurrentUSer()
            .then((response) => {
                if(response) {
                    setIsLoggedIn(true);
                    const userDocument:User = {
                        $id: response.$id || '',
                        email: response.email || '',
                        userId: response.userId || '',
                        dwollaCustomerUrl: response.dwollaCustomerUrl || '',
                        dwollaCustomerId: response.dwollaCustomerId || '',
                        firstName: response.firstName || '',
                        lastName: response.lastName || '',
                        address1: response.address1 || '',
                        city: response.city || '',
                        state: response.state || '',
                        postalCode: response.postalCode || '',
                        dateOfBirth: response.dateOfBirth || '',
                        ssn: response.ssn || '',
                      };
                    setUser(userDocument);
                }else{
                    setIsLoggedIn(false);
                    setUser(null)
                }
            }).
            catch((error) => {
                console.log("global context error", error)
            }).
            finally(() => {
                setIsLoading(false)
            })
    }, [])

    return (

        
        <GlobalContext.Provider
            value={
                {
                    isLoggedIn,
                    setIsLoggedIn,
                    user,
                    setUser,
                    isLoading,
                    setIsLoading,
                    bankLoading,
                    accounts,
                }
            }
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;