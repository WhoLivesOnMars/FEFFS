import { Pressable, View, Text, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  title: string;
  imageUrl?: string;
  dateLabel: string;
  place: string;
  onPress: () => void;

  // ✅ NOUVEAU (optionnel)
  price?: number;
  currency?: "EUR";
};

export function ProgrammeItem({
  title,
  imageUrl,
  dateLabel,
  place,
  onPress,
  price,
  currency = "EUR",
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        tw`px-4 py-3 flex-row items-center ${
          pressed ? "bg-slate-50" : "bg-white"
        }`
      }
    >
      {/* Thumb */}
      <View style={tw`w-12 h-12 rounded-lg overflow-hidden bg-slate-200`}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={tw`w-full h-full`}
            resizeMode="cover"
          />
        ) : null}
      </View>

      {/* Texts */}
      <View style={tw`flex-1 ml-3`}>
        <Text style={tw`text-slate-900 font-bold`} numberOfLines={1}>
          {title}
        </Text>

        <View style={tw`mt-1 flex-row items-center flex-wrap`}>
          {/* Date */}
          <View style={tw`flex-row items-center mr-4`}>
            <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
            <Text style={tw`ml-1 text-slate-400 text-xs`}>
              {dateLabel}
            </Text>
          </View>

          {/* Lieu */}
          <View style={tw`flex-row items-center mr-4`}>
            <Ionicons name="location-outline" size={14} color="#94a3b8" />
            <Text
              style={tw`ml-1 text-slate-400 text-xs`}
              numberOfLines={1}
            >
              {place}
            </Text>
          </View>

          {/*  Prix (UNIQUEMENT si présent) */}
          {typeof price === "number" && (
            <View style={tw`flex-row items-center`}>
              <Ionicons name="pricetag-outline" size={14} color="#94a3b8" />
              <Text style={tw`ml-1 text-slate-400 text-xs`}>
                {price} {currency}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}
