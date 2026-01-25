import { View, Text, Pressable } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
};

export function EventListHeader({ title, subtitle, onBack }: Props) {
  return (
    <View style={tw`px-4 pt-4 pb-2`}>
      <View style={tw`flex-row items-center`}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) =>
            tw`w-10 h-10 rounded-full items-center justify-center ${
              pressed ? "bg-slate-100" : "bg-transparent"
            }`
          }
        >
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
        </Pressable>

        <View style={tw`ml-2`}>
          <Text style={tw`text-lg font-bold text-slate-900`}>{title}</Text>
          {subtitle ? (
            <Text style={tw`text-slate-500 text-xs`}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}
