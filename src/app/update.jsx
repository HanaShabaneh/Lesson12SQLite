
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

export default function UpdateCoffee() {
  const db = useSQLiteContext();

  const [coffees, setCoffees] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [name, setName] = useState("");
  const [type, setType] = useState("Hot");
  const [rating, setRating] = useState("5");

  // READ: Load all coffee records
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

  // Select one record for editing
  function selectCoffee(coffee) {
    setSelectedId(coffee.id);
    setName(coffee.name);
    setType(coffee.type);
    setRating(coffee.rating.toString());
  }

  // UPDATE: Save changes to the selected record
  async function updateCoffee() {
    if (selectedId === null) {
      return;
    }

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
        `UPDATE coffees
         SET name = ?, type = ?, rating = ?
         WHERE id = ?`,
        name.trim(),
        type,
        number,
        selectedId
      );

      setSelectedId(null);
      await loadCoffees();

      Alert.alert("Success", "Coffee updated!");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Could not update coffee.");
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
          <Text style={styles.title}>Update Coffee</Text>
          <Text style={styles.help}>
            Select a coffee from the list to edit it.
          </Text>

          {selectedId !== null && (
            <View style={styles.form}>
              <Text style={styles.formTitle}>
                Editing Coffee ID: {selectedId}
              </Text>

              <Text style={styles.label}>
                Coffee Name
              </Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.label}>
                Type
              </Text>

              <View style={styles.row}>
                <Pressable
                  style={[
                    styles.option,
                    type === "Hot" && styles.selectedOption,
                  ]}
                  onPress={() => setType("Hot")}
                >
                  <Text>Hot</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.option,
                    type === "Cold" && styles.selectedOption,
                  ]}
                  onPress={() => setType("Cold")}
                >
                  <Text>Cold</Text>
                </Pressable>
              </View>

              <Text style={styles.label}>
                Rating (1-5)
              </Text>
              <TextInput
                style={styles.input}
                value={rating}
                onChangeText={setRating}
                keyboardType="number-pad"
                maxLength={2}
              />

              <Pressable
                style={styles.button}
                onPress={updateCoffee}
              >
                <Text style={styles.buttonText}>
                  Save Changes
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSelectedId(null)}
              >
                <Text style={styles.cancel}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          )}

          <Text style={styles.subtitle}>
            Saved Coffees ({coffees.length})
          </Text>
        </View>
      }

      renderItem={({ item }) => (
        <Pressable
          style={[
            styles.card,
            selectedId === item.id && styles.selectedCard,
          ]}
          onPress={() => selectCoffee(item)}
        >
          <Text style={styles.coffeeName}>
            {item.name}
          </Text>

          <Text>Type: {item.type}</Text>
          <Text>Rating: {item.rating}/5</Text>
          <Text style={styles.id}>
            ID: {item.id}
          </Text>

          <Text style={styles.editText}>
            Tap to edit
          </Text>
        </Pressable>
      )}

      ListEmptyComponent={
        <Text style={styles.empty}>
          No coffees to update.
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
    color: "#666666",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  form: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#176B54",
  },
  label: {
    marginTop: 12,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 8,
    padding: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  option: {
    flex: 1,
    backgroundColor: "#EEEEEE",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: "#A7E4CA",
    borderWidth: 1,
    borderColor: "#176B54",
  },
  button: {
    backgroundColor: "#176B54",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancel: {
    textAlign: "center",
    color: "#777777",
    marginTop: 15,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: "#176B54",
  },
  coffeeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#176B54",
    marginBottom: 5,
  },
  id: {
    fontSize: 12,
    color: "#888888",
    marginTop: 5,
  },
  editText: {
    color: "#176B54",
    marginTop: 8,
    fontWeight: "600",
  },
  empty: {
    textAlign: "center",
    color: "#777777",
    marginTop: 20,
  },
});
