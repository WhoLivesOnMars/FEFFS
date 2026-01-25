import { View, Text, Pressable } from "react-native";
import tw from "twrnc";

type Props = {
  years: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
};

export function YearChips({ years, selectedYear, onSelectYear }: Props) {
  return (
    <View style={tw`flex-row flex-wrap`}>
      {years.map((year) => {
        const active = year === selectedYear;

        return (
          <Pressable
            key={year}
            onPress={() => onSelectYear(year)}
            style={({ pressed }) =>
              tw`mr-3 mb-3 px-4 py-2 rounded-full ${
                active
                  ? "bg-orange-600"
                  : pressed
                  ? "bg-slate-100"
                  : "bg-transparent"
              }`
            }
          >
            <Text
              style={tw`font-semibold ${active ? "text-white" : "text-slate-900"}`}
            >
              {year}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
