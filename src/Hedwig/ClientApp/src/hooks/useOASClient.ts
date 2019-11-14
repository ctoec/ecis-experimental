import { useContext, useEffect } from 'react';
import { DefaultApi, Configuration} from '../OAS-generated';
import LoginContext from '../contexts/Login/LoginContext';


export default async () => {
    const { accessToken, withFreshToken } = useContext(LoginContext);
    useEffect(() => {
		withFreshToken();
    });
    
    if(accessToken) {
        var user = await new DefaultApi(new Configuration({accessToken}))
            .usersCurrentGet();
        console.log(user);
    }
}