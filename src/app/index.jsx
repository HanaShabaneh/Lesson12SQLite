
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Alert,
  StyleSheet,
} from "react-native";

import { useFocusEffect } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";

export default function AddCoffee() {
  const db = useSQLiteContext();

  const [name, setName] = useState("");
  const [type, setType] = useState("Hot");
  const [rating, setRating] = useState("5");
  const [coffees, setCoffees] = useState([]);

  // READ: Load coffees from SQLite
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

  // Reload when this tab becomes active
  useFocusEffect(
    useCallback(() => {
      loadCoffees();
    }, [loadCoffees])
  );

  // CREATE: Insert a new coffee
  async function addCoffee() {
    const number = Number(rating);

    if (
      name.trim() === "" ||
      rating.trim() === "" ||
      !Number.isInteger(number) ||
      number < 1 ||
      number > 5
    ) {
      Alert.alert(
        "Invalid Input",
        "Enter a name and a rating from 1 to 5."
      );
      return;
    }

    try {
      await db.runAsync(
        "INSERT INTO coffees (name, type, rating) VALUES (?, ?, ?)",
        name.trim(),
        type,
        number
      );

      setName("");
      setType("Hot");
      setRating("5");

      await loadCoffees();
      Alert.alert("Success", "Coffee added!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not save coffee.");
    }
  }

  return (
    <FlatList
      style={styles.container}
      keyboardShouldPersistTaps="handled"
      data={coffees}
      keyExtractor={(item) => item.id.toString()}

      ListHeaderComponent={
        <View>
          <View style={styles.form}>
            <Text style={styles.title}>Add New Coffee</Text>

            <Text style={styles.label}>Coffee Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Example: Latte"
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.label}>Coffee Type</Text>

            <View style={styles.row}>
              <Pressable
                style={[
                  styles.option,
                  type === "Hot" && styles.selected,
                ]}
                onPress={() => setType("Hot")}
              >
                <Text>Hot</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.option,
                  type === "Cold" && styles.selected,
                ]}
                onPress={() => setType("Cold")}
              >
                <Text>Cold</Text>
              </Pressable>
            </View>

            <Text style={styles.label}>Rating (1-5)</Text>
            <TextInput
              style={styles.input}
              value={rating}
              onChangeText={setRating}
              keyboardType="number-pad"
              maxLength={2}
            />

            <Pressable
              style={styles.button}
              onPress={addCoffee}
            >
              <Text style={styles.buttonText}>
                Add Coffee
              </Text>
            </Pressable>
          </View>

          <Text style={styles.title}>
            Saved Coffees ({coffees.length})
          </Text>
        </View>
      }

      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.coffeeName}>
            {item.name}
          </Text>

          <Text>Type: {item.type}</Text>
          <Text>Rating: {item.rating}/5</Text>
          <Text style={styles.id}>ID: {item.id}</Text>
        </View>
      )}

      ListEmptyComponent={
        <Text style={styles.empty}>
          No coffees saved yet.
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
  form: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#176B54",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    padding: 12,
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#A7E4CA",
    borderWidth: 1,
    borderColor: "#176B54",
  },
  button: {
    backgroundColor: "#176B54",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  coffeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#176B54",
    marginBottom: 5,
  },
  id: {
    color: "#888888",
    marginTop: 5,
    fontSize: 12,
  },
  empty: {
    textAlign: "center",
    color: "#777777",
    marginTop: 20,
  },
});
