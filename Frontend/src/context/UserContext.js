import React, { createContext, useState } from "react";

export const UserDatacontext=createContext();
const Usercontext = ({children}) =>{

    const [user,setUser]=useState({
        email:'',
        password:'',
        name:'',
    })
    return (
        
        <div>
            <UserDatacontext.Provider value={{user,setUser}}>
            {children}
            </UserDatacontext.Provider>
        </div>
    )
}
export default Usercontext;