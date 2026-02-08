// src/features/auth/LoginScreen.tsx
import React from 'react';
import {
    Text, TextInput, StyleSheet, Image, View,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { ButtonPrimary } from '../../core/components/UI/Button';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';

// Define UserRole type if not imported from elsewhere
type UserRole = 'client' | 'coach' | 'nutritionist';

type LoginScreenProps = {
    navigation: any;
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const setCurrentUser = useAppStore((s) => s.setCurrentUser);

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
        // later: call backend + real auth
        const fakeUser = {
            id: 'demo-' + Date.now().toString(),
            role: 'client' as UserRole, // or 'coach' / 'nutritionist'
            fullName: 'Demo User',
            email,
        };

        setCurrentUser(fakeUser); // DO NOT navigation.replace('MainTabs')
    };


    return (
        <Screen showHeader={false}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >

                <View style={styles.container}>
                    {/* Logo */}
                    <Image
                        source={require('../../core/components/Icons/3ashlogo1.png')} // update path/filename
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.textMuted}>
                        Enter your email and password to continue.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={COLORS.textSecondary}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor={COLORS.textSecondary}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <View style={styles.buttonsWrapper}>
                        <View style={styles.button}>
                            <ButtonPrimary label="Login" onPress={handleLogin} />
                        </View>

                        <View style={styles.button}>
                            <ButtonPrimary
                                label="Create a new account"
                                onPress={() => navigation.navigate('Register')}
                            />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 80,
        marginBottom: SPACING.lg,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + 2,
        marginBottom: SPACING.sm,
        fontSize: 14,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surface,
    },
    buttonsWrapper: {
        width: '100%',
        marginTop: SPACING.lg,
    },
    button: {
        marginBottom: SPACING.sm,
    },
});
