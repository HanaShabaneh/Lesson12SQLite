
import React from "react";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Create SQLite database
async function createDatabase(db) {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS coffees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      rating INTEGER NOT NULL
    );
  `);
}

// Beautiful tab icon with colored background
function TabIcon({ name, color, background, focused }) {
  return (
    <View
      style={[
        styles.iconBox,
        {
          backgroundColor: focused
            ? background
            : "transparent",
        },
      ]}
    >
      <FontAwesome6
        name={name}
        size={23}
        color={focused ? color : "#9299A3"}
        solid={focused}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SQLiteProvider
      databaseName="coffee.db"
      onInit={createDatabase}
    >
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "#176B54",
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 20,
          },
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            height: 78,
            paddingTop: 6,
            paddingBottom: 8,
            borderTopColor: "#E5E7EB",
            borderTopWidth: 1,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
          tabBarInactiveTintColor: "#9299A3",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Add Coffee",
            tabBarLabel: "Add",
            tabBarActiveTintColor: "#176B54",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="mug-hot"
                color="#176B54"
                background="#D8F3E5"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="update"
          options={{
            title: "Update Coffee",
            tabBarLabel: "Update",
            tabBarActiveTintColor: "#2563EB",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="pen-to-square"
                color="#2563EB"
                background="#DBEAFE"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="delete"
          options={{
            title: "Delete Coffee",
            tabBarLabel: "Delete",
            tabBarActiveTintColor: "#DC2626",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                name="trash-can"
                color="#DC2626"
                background="#FEE2E2"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </SQLiteProvider>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    width: 48,
    height: 42,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
