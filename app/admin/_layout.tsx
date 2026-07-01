import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function AdminLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#94a3b8",
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="users"
        options={{
          title: "Users",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="riwayat"
        options={{
          title: "Riwayat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="add-user"
        options={{
          title: "add-user",
          tabBarIcon: ({ size }) => (
            <Ionicons name="person-add" size={size} color={"#8e8e93"} />
          ),
        }}
      />
      <Tabs.Screen
        name="edit-user"
        options={{
          title: "Edit User",
          tabBarIcon: ({ size }) => (
            <Ionicons name="create-outline" size={size} color="#8e8e93" />
          ),
        }}
      />
      <Tabs.Screen
        name="detail-riwayat"
        options={{
          title: "Detail Riwayat",
          tabBarIcon: ({ size }) => (
            <Ionicons
              name="document-text-outline" // Ikon dokumen teks untuk detail data
              size={size}
              color="#8e8e93" // Warna abu-abu garis tepi konsisten
            />
          ),
        }}
      />
    </Tabs>
  );
}
