import React, { useRef } from "react";
import {
  TouchableOpacity,
  Animated,
  TouchableOpacityProps,
} from "react-native";

type AnimatedTouchableProps = TouchableOpacityProps & {
  children: React.ReactNode;
};

export default function AnimatedTouchable({
  children,
  style,
  ...props
}: AnimatedTouchableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        {...props}
        style={style}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
