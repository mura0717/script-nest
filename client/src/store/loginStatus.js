import { writable } from 'svelte/store';
import { getRequest } from "../store/fetchStore.js";

//Writable isLoggedIn variable
export const isLoggedIn = writable(false);

//The function that is called by handleLogin in Login.
export async function updateLoginStatus(){
    const loginStatus = await loginStatusCheck();
    isLoggedIn.set(loginStatus)
}

// Backend login status check 
async function loginStatusCheck (){
    try {
        const response = await getRequest("/api/auth/login/guard")
        if(response.status === 200) {
            return true;
        } else {
            console.log("Response:", response);
            return false;
        }
    } catch (error){
        throw new Error(`Status check error. Status: ${error}`);
    }
}