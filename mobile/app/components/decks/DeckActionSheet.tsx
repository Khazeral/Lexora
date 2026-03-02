import { useState } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDeck, deleteDeck } from "@/services/decks.api";
import { Deck } from "@/types";
import { pillShadow } from "../ui/GlowStyles";
import AnimatedTouchable from "../ui/AnimatedTouchable";
import ConfirmModal from "../ConfirmModal";

type DeckActionSheetProps = {
  deck: Deck | null;
  visible: boolean;
  onClose: () => void;
};

type SheetMode = "actions" | "rename";

export default function DeckActionSheet({
  deck,
  visible,
  onClose,
}: DeckActionSheetProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [mode, setMode] = useState<SheetMode>("actions");
  const [newName, setNewName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateDeck(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDeck(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
      handleClose();
    },
  });

  const handleClose = () => {
    setMode("actions");
    setNewName("");
    setShowDeleteModal(false);
    onClose();
  };

  const handleRenamePress = () => {
    if (deck) {
      setNewName(deck.name);
      setMode("rename");
    }
  };

  const handleRenameSubmit = () => {
    if (deck && newName.trim().length > 0) {
      renameMutation.mutate({ id: deck.id, name: newName.trim() });
    }
  };

  const handleDeletePress = () => {
    setShowDeleteModal(true);
  };

  if (!deck) return null;

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
          onPress={handleClose}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Pressable
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#134c39",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderWidth: 2,
                borderBottomWidth: 0,
                borderColor: "#2a7a60",
                paddingBottom: Platform.OS === "ios" ? 40 : 24,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 12,
                  paddingBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#2a7a60",
                  }}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  gap: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#2a7a60",
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: "#5b8af5",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="albums" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: "#e8edf5",
                      fontSize: 16,
                      fontWeight: "700",
                      letterSpacing: 1,
                    }}
                  >
                    {deck.name.toUpperCase()}
                  </Text>
                  <Text
                    style={{ color: "#6e9e8a", fontSize: 12, marginTop: 2 }}
                  >
                    {deck.cardCount}{" "}
                    {deck.cardCount > 1
                      ? t("decks.card.cards_plural_short", "cartes")
                      : t("decks.card.cards_short", "carte")}
                  </Text>
                </View>
              </View>

              {mode === "actions" ? (
                <View style={{ paddingHorizontal: 24, gap: 4 }}>
                  <AnimatedTouchable
                    onPress={handleRenamePress}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 14,
                      backgroundColor: "#0d2e22",
                      borderWidth: 1.5,
                      borderColor: "#2a7a60",
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: "#5b8af5",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="pencil" size={18} color="#fff" />
                    </View>
                    <Text
                      style={{
                        color: "#e8edf5",
                        fontSize: 15,
                        fontWeight: "600",
                        flex: 1,
                      }}
                    >
                      {t("decks.actions.rename", "Renommer")}
                    </Text>
                  </AnimatedTouchable>

                  <AnimatedTouchable
                    onPress={handleDeletePress}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 14,
                      paddingVertical: 14,
                      paddingHorizontal: 16,
                      borderRadius: 14,
                      backgroundColor: "#0d2e22",
                      borderWidth: 1.5,
                      borderColor: "#2a7a60",
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: "#e8453c",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="trash" size={18} color="#fff" />
                    </View>
                    <Text
                      style={{
                        color: "#e8453c",
                        fontSize: 15,
                        fontWeight: "600",
                        flex: 1,
                      }}
                    >
                      {t("decks.actions.delete", "Supprimer")}
                    </Text>
                  </AnimatedTouchable>
                </View>
              ) : (
                <View style={{ paddingHorizontal: 24, gap: 12 }}>
                  <View
                    style={{
                      backgroundColor: "#0d2e22",
                      borderRadius: 14,
                      borderWidth: 2,
                      borderColor: "#5b8af5",
                      padding: 4,
                    }}
                  >
                    <TextInput
                      value={newName}
                      onChangeText={setNewName}
                      placeholder={t(
                        "decks.actions.renamePlaceholder",
                        "Nom du deck",
                      )}
                      placeholderTextColor="#4a7a6a"
                      autoFocus
                      maxLength={50}
                      style={{
                        color: "#e8edf5",
                        fontSize: 16,
                        fontWeight: "600",
                        paddingHorizontal: 14,
                        paddingVertical: 12,
                      }}
                      onSubmitEditing={handleRenameSubmit}
                      returnKeyType="done"
                    />
                  </View>

                  <AnimatedTouchable
                    onPress={handleRenameSubmit}
                    disabled={
                      newName.trim().length === 0 || renameMutation.isPending
                    }
                    activeOpacity={0.8}
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        paddingVertical: 14,
                        borderRadius: 14,
                        backgroundColor:
                          newName.trim().length > 0 ? "#44d9a0" : "#1a5c45",
                        borderWidth: 2,
                        borderColor:
                          newName.trim().length > 0 ? "#6ee8b7" : "#2a7a60",
                      },
                      newName.trim().length > 0 ? pillShadow.sm : undefined,
                    ]}
                  >
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={newName.trim().length > 0 ? "#0b3d2e" : "#4a7a6a"}
                    />
                    <Text
                      style={{
                        color:
                          newName.trim().length > 0 ? "#0b3d2e" : "#4a7a6a",
                        fontSize: 15,
                        fontWeight: "700",
                        letterSpacing: 1,
                      }}
                    >
                      {t("decks.actions.renameConfirm", "RENOMMER")}
                    </Text>
                  </AnimatedTouchable>
                </View>
              )}
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>

      <ConfirmModal
        visible={showDeleteModal}
        title={t("decks.actions.deleteTitle", "Supprimer le deck")}
        message={t("decks.actions.deleteMessage", {
          name: deck.name,
          defaultValue: `Êtes-vous sûr de vouloir supprimer "${deck.name}" ? Cette action est irréversible.`,
        })}
        confirmText={t("common.delete", "Supprimer")}
        cancelText={t("common.cancel", "Annuler")}
        type="danger"
        onConfirm={() => {
          setShowDeleteModal(false);
          deleteMutation.mutate(deck.id);
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
