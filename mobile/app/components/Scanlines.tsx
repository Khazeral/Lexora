import { StyleSheet, Dimensions, View } from "react-native";
import Svg, { Defs, Pattern, Rect, Line } from "react-native-svg";

const { width, height } = Dimensions.get("screen");

export default function Scanlines() {
  return (
    <View style={styles.container} pointerEvents="none">
      <Svg width={width} height={height + 100}>
        <Defs>
          <Pattern
            id="scanlines"
            patternUnits="userSpaceOnUse"
            width="4"
            height="4"
          >
            <Line
              x1="0"
              y1="0"
              x2={width}
              y2="0"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="2"
            />
          </Pattern>
        </Defs>
        <Rect
          x="0"
          y="0"
          width={width}
          height={height + 100}
          fill="url(#scanlines)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    elevation: 9999,
  },
});
