import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type ToastVariant = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastContextType {
  showToast: (opts: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState<ToastVariant>('info');
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 80, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start(() => setVisible(false));
  }, [opacity, translateY]);

  const showToast = useCallback((opts: ToastOptions) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setMessage(opts.message);
    setVariant(opts.variant || 'info');
    setVisible(true);
    Animated.parallel([
      Animated.timing(translateY, { toValue: 0, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    const duration = opts.durationMs ?? 3000;
    timerRef.current = setTimeout(() => hide(), duration);
  }, [hide, opacity, translateY]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {visible && (
        <Animated.View style={[styles.toast, { opacity, transform: [{ translateY }] }] }>
          <View style={[styles.inner, variantStyle(variant)]}>
            <Text style={styles.text}>{message}</Text>
            <TouchableOpacity onPress={hide}>
              <Text style={styles.action}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
};

function variantStyle(v: ToastVariant) {
  switch (v) {
    case 'success':
      return { backgroundColor: '#10B981' };
    case 'error':
      return { backgroundColor: '#EF4444' };
    case 'info':
    default:
      return { backgroundColor: '#111827' };
  }
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 20,
    alignItems: 'center',
    zIndex: 9999,
  },
  inner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 14,
    flexShrink: 1,
  },
  action: {
    color: '#FFFFFF',
    fontSize: 12,
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
});
