// src/core/components/Layout/Screen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ViewStyle,
    StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../theme';
import { Image, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../../store/appStore';

type ScreenProps = {
    title?: string;
    showHeader?: boolean;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
};

export const Screen: React.FC<ScreenProps> = ({
    title,
    showHeader = true,
    children,
    style,
}) => {
    const userName = 'Ammar'; // later: get from store and pass down if needed
    const currentUser = useAppStore((s) => s.currentUser);
    const currentProviderId = useAppStore((s) => s.currentProviderId);
    return (
        <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" />
            {showHeader && (
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.avatarCircle}>
                            {/* If you have avatar uri, replace with <Image source={{uri}} /> */}
                        </View>
                        <View>
                            <Text style={styles.headerWelcome}>Welcome back!</Text>
                            <Text style={styles.headerName}>{currentUser?.fullName}</Text>
                        </View>
                    </View>

                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.headerIconButton}>
                            {/* Search icon slot */}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerIconButton}>
                            {/* Notification icon slot */}
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {title && !showHeader && (
                <Text style={styles.titleNoHeader}>{title}</Text>
            )}
            <View style={[styles.content, style]}>{children}</View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surface,
        marginRight: SPACING.sm,
        borderWidth: 2,
        borderColor: COLORS.brand,
    },
    headerWelcome: {
        ...TYPOGRAPHY.label,
        color: COLORS.textSecondary,
    },
    headerName: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.textPrimary,
    },
    headerRight: {
        flexDirection: 'row',
    },
    headerIconButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    titleNoHeader: {
        ...TYPOGRAPHY.title,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
    },
    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.lg,
    },
});
