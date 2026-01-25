// src/components/navigation/BottomNavBar.tsx
import React from "react";
import { View, Text, Pressable, Platform } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router, usePathname, type Href } from "expo-router";

type NavItem = {
  key: "home" | "search" | "schedule" | "profile";
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href; 
};

const ITEMS: NavItem[] = [
  { key: "home", label: "Home", icon: "home-outline", href: "/" as Href },
  { key: "search", label: "Search", icon: "search-outline", href: "/(search)" as Href },
  { key: "schedule", label: "schedule", icon: "calendar-outline", href: "/(schedule)" as Href },
  { key: "profile", label: "Profil", icon: "person-outline", href: "/(profile)" as Href },
];

function isActivePath(pathname: string, href: Href) {
  const target = String(href);
  return pathname === target || pathname.startsWith(target + "/");
}

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <View style={tw`absolute left-0 right-0 bottom-0`}>
      <View
        style={[
          tw`bg-orange-600`,
          Platform.select({
            ios: tw`shadow-lg`,
            android: tw``,
            default: tw``,
          }),
        ]}
      >
        <View style={tw`flex-row items-center justify-between px-5 py-3`}>
          {ITEMS.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Pressable
                key={item.key}
                onPress={() => router.push(item.href)}
                style={({ pressed }) =>
                  tw`items-center ${pressed ? "opacity-90" : "opacity-100"}`
                }
              >
                {/* Icon bubble like your mock */}
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
