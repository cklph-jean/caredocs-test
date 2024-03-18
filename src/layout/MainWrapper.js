import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { PageTitle } from '../utils/string-utils'

// Singed Out Stacks
import Login from '../screens/login';
import ForgotPassword from '../screens/forgot-password'
import CreateAccount from '../screens/create-account';
import ChooseYourPackage from '../screens/create-account/choose-your-package';
import PaymentMethod from '../screens/create-account/payment-method';
// End of Signed Out Stacks

// Signed In Stacks
import Dashboard from '../screens/dashboard';
import Communication from '../screens/communication';
import ResidentialNotes from '../screens/residential-notes';
import Residents from '../screens/residents';
import Staff from '../screens/staff';
import Facilities from '../screens/facilities';
// End of Signed In Stacks


import useAuthStore from '../store/apis/caredocs/auth';
import { retrieveData } from '../utils/asyncStorage';
import { useEffect, useState } from "react";

// End of Signed In Stacks

const SignedInStack = createNativeStackNavigator();
const SignedOutStack = createNativeStackNavigator();

const SignedOutNavigator = () => {
    return (
        <SignedOutStack.Navigator>
            <SignedOutStack.Screen name="login" component={Login} options={{ headerShown: false }} />
            <SignedOutStack.Screen name="payment-method" component={PaymentMethod} options={{ headerShown: false }} />
            <SignedOutStack.Screen name="create-account" component={CreateAccount} options={{ headerShown: false }} />
            <SignedOutStack.Screen name="forgot-password" component={ForgotPassword} options={{ headerShown: false }} />
            <SignedOutStack.Screen name="choose-your-package" component={ChooseYourPackage} options={{ headerShown: false }} />
        </SignedOutStack.Navigator>
    )
}

const SignedInNavigator = () => {
    return (
        <SignedInStack.Navigator>
            <SignedInStack.Screen name="staff" component={Staff} options={{ headerShown: false }} />
            <SignedInStack.Screen name="dashboard" component={Dashboard} options={{ headerShown: false }} />
            <SignedInStack.Screen name="communication" component={Communication} options={{ headerShown: false }} />
            <SignedInStack.Screen name="residential-notes" component={ResidentialNotes} options={{ headerShown: false }} />
            <SignedInStack.Screen name="residents" component={Residents} options={{ headerShown: false }} />
            <SignedInStack.Screen name="facilities" component={Facilities} options={{ headerShown: false }} />
        </SignedInStack.Navigator>
    )
}


const navigationConfig = {
    prefixes: ['http://localhost:8081', 'localhost:8081'],
    config: {
        screens: {
            Login: 'login',
            ForgotPassword: 'forgot-password',
            CreateAccount: 'create-account',
            Dashboard: 'dashboard',
            Communication: 'communication',
        },
    },
};

export default function MainWrapper() {
    const { isAuthenticated, setUser } = useAuthStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // const isLoggedIn = (retrieveData('token') || isAuthenticated) ? true : false;

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await retrieveData('token');
                setIsLoggedIn(token || isAuthenticated);

                if ( token ) {
                    const userData = await retrieveData('userData');

                    setUser(JSON.parse(userData))
                }
            } catch (error) {
                // Handle error
                console.error("Error fetching token:", error);
            }
        };

        checkLoginStatus();
    }, [isAuthenticated, isLoggedIn]);

    return (
        <NavigationContainer
            linking={navigationConfig}
            documentTitle={{
                formatter: (options, route) => `${options?.title ?? PageTitle(route?.name) ?? 'Home'} | CareDocs`,
            }}>
            <View className="z-[1] flex-1 w-full bg-[url('./src/assets/svg/bgImage.png')] bg-cover overflow-y-auto">
                <View className="w-full">
                    {
                        !isLoggedIn ? <SignedOutNavigator /> : <SignedInNavigator />
                    }

                </View>
            </View>

        </NavigationContainer>
    )
}
