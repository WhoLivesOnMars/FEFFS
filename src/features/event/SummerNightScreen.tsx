import { Component } from "react";
import { View, Text, Image, Pressable } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export class SummerNightScreen extends Component<{}, { selectedYear: number }> {
  constructor(props: {}) {
    super(props);
    this.state = { selectedYear: 2026 };
  }

  render() {
    const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

    const renderYearChip = (year: number) => {
      const active = year === this.state.selectedYear;

      return (
        <Pressable
          key={year}
          onPress={() => this.setState({ selectedYear: year })}
          style={({ pressed }) =>
            tw`mr-3 mb-3 px-4 py-2 rounded-full ${
              active ? "bg-orange-600" : pressed ? "bg-slate-100" : "bg-transparent"
            }`
          }
        >
          <Text style={tw`font-semibold ${active ? "text-white" : "text-slate-900"}`}>
            {year}
          </Text>
        </Pressable>
      );
    };

    return (
      <View style={tw`flex-1 bg-white`}>
        {/* HEADER */}
        <View style={tw`px-4 pt-4`}>
          <View style={tw`flex-row items-center`}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) =>
                tw`w-10 h-10 rounded-full items-center justify-center ${
                  pressed ? "bg-slate-100" : "bg-transparent"
                }`
              }
            >
              <Ionicons name="chevron-back" size={22} color="#0f172a" />
            </Pressable>

            <View style={tw`ml-2`}>
              <Text style={tw`text-lg font-bold text-slate-900`}>Cinéma plein air</Text>
              <Text style={tw`text-slate-500 text-xs`}>Programmation & archives</Text>
            </View>
          </View>
        </View>

        {/* HERO */}
        <View style={tw`mt-3 px-4`}>
          <Image
            source={{
              uri: "https://strasbourgfestival.com/wp-content/uploads/2024/06/CPA2025_banner_700x370.png",
            }}
            resizeMode="cover"
            style={tw`w-full h-48 rounded-2xl`}
          />
        </View>

        {/* ANNÉE */}
        <View style={tw`mt-4 px-4`}>
          <Text style={tw`text-slate-900 font-extrabold tracking-wider`}>ANNÉE</Text>
          <View style={tw`mt-3 flex-row flex-wrap`}>
            {YEARS.map(renderYearChip)}
          </View>
        </View>
      </View>
    );
  }
}
