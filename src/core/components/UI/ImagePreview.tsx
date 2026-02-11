import React from 'react';
import {
    View,
    Image,
    Modal,
    StyleSheet,
    TouchableOpacity,
    Text,
} from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../theme';

export type PreviewImage = {
    id: string;
    uri: string;
};

type ImagePreviewProps = {
    images: PreviewImage[];                 // list of images to show
    onRemove?: (id: string) => void;        // called when recycle/delete pressed
};

export const ImagePreview: React.FC<ImagePreviewProps> = ({
    images,
    onRemove,
}) => {
    const [visible, setVisible] = React.useState(false);
    const [active, setActive] = React.useState<PreviewImage | null>(null);

    const open = (img: PreviewImage) => {
        setActive(img);
        setVisible(true);
    };

    const close = () => {
        setVisible(false);
        setActive(null);
    };

    const handleRemove = () => {
        if (active && onRemove) {
            onRemove(active.id);
        }
        close();
    };

    return (
        <>
            {/* small previews */}
            <View style={styles.row}>
                {images.map((img) => (
                    <TouchableOpacity
                        key={img.id}
                        style={styles.thumbWrapper}
                        onPress={() => open(img)}
                    >
                        <Image source={{ uri: img.uri }} style={styles.thumb} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* full-screen viewer */}
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={close}
            >
                <View style={styles.backdrop}>
                    <View style={styles.viewerContainer}>
                        {active && (
                            <Image source={{ uri: active.uri }} style={styles.fullImage} />
                        )}

                        <View style={styles.viewerActions}>
                            <TouchableOpacity style={styles.actionButton} onPress={close}>
                                <Text style={styles.actionText}>Close</Text>
                            </TouchableOpacity>

                            {onRemove && active && (
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.deleteButton]}
                                    onPress={handleRemove}
                                >
                                    <Text style={styles.actionText}>🗑</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
    },
    thumbWrapper: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.sm,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
    },
    thumb: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewerContainer: {
        width: '90%',
        height: '80%',
        borderRadius: RADIUS.lg,
        overflow: 'hidden',
    },
    fullImage: {
        flex: 1,
        resizeMode: 'contain',
        backgroundColor: 'black',
    },
    viewerActions: {
        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        flexDirection: 'row',
        gap: SPACING.xs,
    },
    actionButton: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.pill ?? 20,
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    deleteButton: {
        backgroundColor: 'rgba(220,38,38,0.9)', // red
    },
    actionText: {
        color: COLORS.white,
        fontSize: 13,
    },
});
