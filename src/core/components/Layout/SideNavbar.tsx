// src/core/components/Layout/SideNavbar.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigateDiscover: () => void;
  onNavigateSubscriptions: () => void;
};

export const SideNavbar: React.FC<Props> = ({
  visible,
  onClose,
  onNavigateDiscover,
  onNavigateSubscriptions,
}) => {
  const translateX = React.useRef(new Animated.Value(width)).current;

  // Open animation when visible becomes true
  React.useEffect(() => {
    if (visible) {
      Animated.timing(translateX, {
        toValue: 0,
        duration: 450,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateX]);

  const handleClosePress = () => {
    Animated.timing(translateX, {
      toValue: width, // slide out to the right
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      onClose(); // after animation, actually hide it in parent
    });
  };

  // Always render; hide interaction when not visible
  return (
    <View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[styles.overlay, { opacity: visible ? 1 : 0 }]}
    >
      <TouchableOpacity style={styles.backdrop} onPress={handleClosePress} />

      <Animated.View
        style={[
          styles.panel,
          { transform: [{ translateX }] },
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Menu</Text>
          <TouchableOpacity onPress={handleClosePress}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onNavigateDiscover();
            handleClosePress();
          }}
        >
          <Text style={styles.itemText}>Discover</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.item}
          onPress={() => {
            onNavigateSubscriptions();
            handleClosePress();
          }}
        >
          <Text style={styles.itemText}>Subscriptions</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 100,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  panel: {
    width,
    backgroundColor: '#11271a',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#F9FAFB',
    fontSize: 20,
    fontWeight: '600',
  },
  closeText: {
    color: '#F9FAFB',
    fontSize: 20,
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    color: '#F9FAFB',
    fontSize: 16,
  },
});
