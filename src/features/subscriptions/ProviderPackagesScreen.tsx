// src/features/subscriptions/ProviderPackagesScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { PackageCard } from '../../core/components/UI/PackageCard';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../core/theme';

type ProviderPackagesScreenProps = {
    route: any;
    navigation: any;
};

export const ProviderPackagesScreen: React.FC<
    ProviderPackagesScreenProps
> = ({ route, navigation }) => {
    const { providerId } = route.params as { providerId: string };

    const providers = useAppStore((s) => s.providers);
    const packages = useAppStore((s) => s.packages);

    const provider = providers.find((p) => p.id === providerId);

    if (!provider) {
        return (
            <Screen title="Provider">
                <Text style={styles.textMuted}>Provider not found.</Text>
            </Screen>
        );
    }

    const providerPackages = packages.filter(
        (p) => p.providerId === provider.id,
    );

    const handleSelectPackage = (packageId: string) => {
        navigation.navigate('Checkout', { providerId: provider.id, packageId });
    };

    return (
        <Screen title={provider.fullName}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.textMuted}>
                    {provider.title}{' '}
                    <Text style={styles.highlight}>
                        ({provider.role === 'coach' ? 'Coach' : 'Nutritionist'})
                    </Text>
                </Text>
                <Text style={styles.textMuted}>
                    Experience:{' '}
                    <Text style={styles.highlight}>
                        {provider.yearsOfExperience} years
                    </Text>
                </Text>
                <Text style={styles.textMuted}>
                    Languages:{' '}
                    <Text style={styles.highlight}>
                        {provider.languages.join(', ')}
                    </Text>
                </Text>

                <SectionHeader label="Packages" />
                {providerPackages.length === 0 ? (
                    <Text style={styles.textMuted}>
                        No packages for this provider yet.
                    </Text>
                ) : (
                    <View style={styles.packagesWrapper}>
                        {providerPackages.map((pack) => (
                            <PackageCard
                                key={pack.id}
                                title={pack.title}
                                durationInDays={pack.durationInDays}
                                price={pack.price}
                                currency={pack.currency}
                                description={pack.description}
                                onPress={() => handleSelectPackage(pack.id)}
                                actionLabel="Choose"
                            />
                        ))}
                    </View>
                )}
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        paddingTop: SPACING.sm,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginBottom: 4,
    },
    highlight: {
        color: COLORS.brand,
    },
    packagesWrapper: {
        width: '100%',
        marginTop: SPACING.xs,
    },
});
