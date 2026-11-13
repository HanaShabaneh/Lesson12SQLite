
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function DeleteCoffee() {
  const db = useSQLiteContext();

  const [coffees, setCoffees] = useState([]);

  // READ: Load all coffees
  const loadCoffees = useCallback(async () => {
    try {
      const results = await db.getAllAsync(
        "SELECT * FROM coffees ORDER BY id DESC"
      );

      setCoffees(results);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not load coffees.");
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadCoffees();
    }, [loadCoffees])
  );

  // DELETE: Remove one record
  async function deleteCoffee(id) {
    try {
      await db.runAsync(
        "DELETE FROM coffees WHERE id = ?",
        id
      );

      await loadCoffees();

      Alert.alert("Success", "Coffee deleted!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not delete coffee.");
    }
  }

  // Ask for confirmation before deleting
  function confirmDelete(coffee) {
    Alert.alert(
      "Delete Coffee",
      `Are you sure you want to delete ${coffee.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCoffee(coffee.id),
        },
      ]
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={coffees}
      keyExtractor={(item) => item.id.toString()}

      ListHeaderComponent={
        <View>
          <Text style={styles.title}>
            Delete Coffee
          </Text>

          <Text style={styles.help}>
            Select a coffee to remove it from the database.
          </Text>

          <Text style={styles.subtitle}>
            Saved Coffees ({coffees.length})
          </Text>
        </View>
      }

      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.coffeeName}>
              {item.name}
            </Text>

            <Text>Type: {item.type}</Text>
            <Text>Rating: {item.rating}/5</Text>
            <Text style={styles.id}>
              ID: {item.id}
            </Text>
          </View>

          <Pressable
            style={styles.deleteButton}
            onPress={() => confirmDelete(item)}
          >
            <Text style={styles.buttonText}>
              Delete
            </Text>
          </Pressable>
        </View>
      )}

      ListEmptyComponent={
        <Text style={styles.empty}>
          No coffees to delete.
        </Text>
      }

      contentContainerStyle={{ paddingBottom: 30 }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7F5",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#176B54",
    marginTop: 20,
    marginBottom: 8,
  },
  help: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  info: {
    flex: 1,
  },
  coffeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#176B54",
    marginBottom: 5,
  },
  id: {
    color: "#888888",
    fontSize: 12,
    marginTop: 5,
  },
  deleteButton: {
    backgroundColor: "#C0392B",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    color: "#777777",
    marginTop: 20,
  },
});
