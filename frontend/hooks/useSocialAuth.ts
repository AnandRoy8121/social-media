import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react"
import { Alert } from "react-native";



export const useSocialAuth = ()=>{
    const [isLoading,setIsLoading] = useState<boolean>(false);
    const {startSSOFlow} = useSSO();

    const handleSocialAuth = async(strategy:'oauth_google' | 'oauth_apple')=>{
        setIsLoading(true);
        try {
            const { createdSessionId,setActive} = await startSSOFlow({strategy})
            if(createdSessionId && setActive){
                await setActive({session:createdSessionId});
            }
            
        } catch (error) {
            console.log('Error in social auth',error)
            const provider = strategy ==='oauth_google' ? 'google':'apple';
            Alert.alert('Error',`Failed to signIn with ${provider}. Please try again`);
        } finally{
            setIsLoading(false)
        };
    }
    return {isLoading, handleSocialAuth };
}