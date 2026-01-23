import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

type HeaderProps = {
  username: string;
};

export default function Header({ username }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>{t("home.greeting")}</Text>
        <Text style={styles.username}>
          {username} {t("home.wave")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  greeting: {
    fontSize: 16,
    color: "#64748b",
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 4,
  },
});
