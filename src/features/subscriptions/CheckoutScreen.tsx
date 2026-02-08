import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';

const COLORS = {
    text: '#1F2933',
    muted: '#9CA3AF',
    border: '#E5E7EB',
    primary: '#2F80ED',
    bgSoft: '#F9FAFB',
    success: '#10B981',
};

type CheckoutScreenProps = {
    route: any;
    navigation: any;
};

type PaymentMethod = 'wallet' | 'instapay';

export const CheckoutScreen: React.FC<CheckoutScreenProps> = ({
    route,
    navigation,
}) => {
    const { providerId, packageId } = route.params as {
        providerId: string;
        packageId: string;
    };

    const providers = useAppStore((s) => s.providers);
    const packages = useAppStore((s) => s.packages);
    const currentUser = useAppStore((s) => s.currentUser);

    const [method, setMethod] = React.useState<PaymentMethod>('wallet');
    const [isProcessing, setIsProcessing] = React.useState(false);

    const provider = providers.find((p) => p.id === providerId);
    const pack = packages.find((p) => p.id === packageId);

    if (!provider || !pack) {
        return (
            <Screen title="Checkout">
                <Text style={styles.textMuted}>
                    Something went wrong. Please go back and select the package again.
                </Text>
            </Screen>
        );
    }

    const handlePay = async () => {
        if (!currentUser) {
            Alert.alert('Login required', 'Please log in to complete payment.');
            return;
        }

        setIsProcessing(true);

        // In real app, call your backend to create payment session and get URL + OTP.
        // For now we'll use placeholder URLs.
        const paymentUrl =
            method === 'wallet'
                ? 'https://example.com/wallet/otp'
                : 'https://example.com/instapay/otp';

        try {
            const supported = await Linking.canOpenURL(paymentUrl);
            if (!supported) {
                Alert.alert('Error', 'Cannot open payment page on this device.');
                setIsProcessing(false);
                return;
            }

            await Linking.openURL(paymentUrl);

            // After user finishes OTP and comes back, you would normally
            // listen to a deep link / webhook. For now we just show success:
            Alert.alert(
                'Payment pending',
                'After you approve the OTP, your subscription will be activated.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Subscriptions'),
                    },
                ],
            );
        } catch (err) {
            Alert.alert('Error', 'Failed to start payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Screen title="Checkout">
            <View style={styles.container}>
                <Card>
                    <SectionHeader label="Package summary" />
                    <Text style={styles.providerName}>{provider.fullName}</Text>
                    <Text style={styles.providerMeta}>
                        {provider.role === 'coach' ? 'Coach' : 'Nutritionist'} ·{' '}
                        {provider.yearsOfExperience} yrs exp
                    </Text>

                    <View style={styles.divider} />

                    <Text style={styles.packTitle}>{pack.title}</Text>
                    <Text style={styles.packMeta}>
                        {pack.durationInDays} days · {pack.price} {pack.currency}
                    </Text>
                    {pack.description ? (
                        <Text style={styles.packDescription}>{pack.description}</Text>
                    ) : null}
                </Card>

                <View style={styles.section}>
                    <SectionHeader label="Payment method" />
                    <View style={styles.methodRow}>
                        <PaymentChip
                            label="Wallet"
                            description="Pay from your in‑app wallet"
                            active={method === 'wallet'}
                            onPress={() => setMethod('wallet')}
                        />
                        <PaymentChip
                            label="InstaPay"
                            description="Instant bank transfer"
                            active={method === 'instapay'}
                            onPress={() => setMethod('instapay')}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <SectionHeader label="Total" />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Amount</Text>
                        <Text style={styles.totalValue}>
                            {pack.price} {pack.currency}
                        </Text>
                    </View>
                    <Text style={styles.textMutedSmall}>
                        You will be redirected to a secure page to approve an OTP and
                        confirm the payment.
                    </Text>
                </View>

                <TouchableOpacity
                    style={[styles.payButton, isProcessing && styles.payButtonDisabled]}
                    onPress={handlePay}
                    disabled={isProcessing}
                >
                    <Text style={styles.payButtonText}>
                        {isProcessing ? 'Processing…' : 'Confirm & pay'}
                    </Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
};

type PaymentChipProps = {
    label: string;
    description: string;
    active: boolean;
    onPress: () => void;
};

const PaymentChip: React.FC<PaymentChipProps> = ({
    label,
    description,
    active,
    onPress,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.methodCard, active && styles.methodCardActive]}
        >
            <View>
                <Text
                    style={[styles.methodLabel, active && styles.methodLabelActive]}
                >
                    {label}
                </Text>
                <Text
                    style={[
                        styles.methodDescription,
                        active && styles.methodDescriptionActive,
                    ]}
                >
                    {description}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 24,
    },
    textMuted: {
        textAlign: 'center',
        fontSize: 14,
        color: COLORS.muted,
        marginTop: 16,
    },
    textMutedSmall: {
        fontSize: 12,
        color: COLORS.muted,
        marginTop: 4,
    },
    providerName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
        marginTop: 4,
    },
    providerMeta: {
        fontSize: 13,
        color: COLORS.muted,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: 12,
    },
    packTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.text,
    },
    packMeta: {
        fontSize: 13,
        color: COLORS.muted,
        marginTop: 2,
    },
    packDescription: {
        fontSize: 13,
        color: COLORS.text,
        marginTop: 8,
    },
    section: {
        width: '100%',
        marginTop: 16,
    },
    methodRow: {
        flexDirection: 'row',
        marginTop: 8,
    },
    methodCard: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        padding: 12,
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    methodCardActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.bgSoft,
    },
    methodLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.text,
    },
    methodLabelActive: {
        color: COLORS.primary,
    },
    methodDescription: {
        fontSize: 12,
        color: COLORS.muted,
        marginTop: 2,
    },
    methodDescriptionActive: {
        color: COLORS.text,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 15,
        color: COLORS.text,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.text,
    },
    payButton: {
        marginTop: 24,
        backgroundColor: COLORS.primary,
        borderRadius: 24,
        paddingVertical: 14,
        alignItems: 'center',
    },
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default CheckoutScreen;
