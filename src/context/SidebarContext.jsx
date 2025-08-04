import {createContext, useContext, useState} from 'react';

export const SidebarContext = createContext();

export const SidebarProvider = ({children}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <SidebarContext.Provider value={{isCollapsed, setIsCollapsed}}>
            {children}
        </SidebarContext.Provider>
    );
};
