// src/components/navigation/BottomNavBar.tsx
import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments, type Href } from "expo-router";

type NavItem = {
  key: "home" | "search" | "schedule" | "profile";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
  group: "home" | "search" | "schedule" | "profile";
};

const ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "home-outline", href: "/(home)" as Href, group: "home" },
  { key: "search", label: "Search", icon: "search-outline", href: "/(search)" as Href, group: "search" },
  { key: "schedule", label: "Planning", icon: "calendar-outline", href: "/(schedule)" as Href, group: "schedule" },
  { key: "profile", label: "Profil", icon: "person-outline", href: "/(profile)" as Href, group: "profile" },
];

function clean(seg?: string) {
  return (seg ?? "").replace(/[()]/g, ""); // "(schedule)" -> "schedule"
}

export function BottomNavBar() {
  const router = useRouter();
  const segments = useSegments();

  const currentGroup = clean(segments?.[0] as string | undefined);

  const isActive = (item: NavItem) => item.group === currentGroup;

  const goTo = (item: NavItem) => {
    // bottom nav = replace (pas push)
    router.replace(item.href);
  };

  return (
    <View style={tw`absolute left-0 right-0 bottom-0`} pointerEvents="box-none">
      <View
        pointerEvents="auto"
        style={[
          tw`bg-orange-600`,
          Platform.select({
            ios: tw`shadow-lg`,
            android: tw`elevation-8`,
            default: tw``,
          }),
        ]}
      >
        <View style={tw`flex-row items-center justify-between px-5 py-3`}>
          {ITEMS.map((item) => {
            const active = isActive(item);

            return (
              <Pressable
                key={item.key}
                onPress={() => goTo(item)}
                style={({ pressed }) =>
                  tw`items-center ${pressed ? "opacity-70" : "opacity-100"}`
                }
              >
                <View
                  style={tw`w-12 h-12 rounded-2xl items-center justify-center ${
                    active ? "bg-white" : "bg-transparent"
                  }`}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={active ? "#F97316" : "#FFFFFF"}
                  />
                </View>

                <Text
                  style={tw`mt-1 text-[11px] ${
                    active ? "text-white font-semibold" : "text-white/90"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
