import { Component } from "react";
import { View, Text, Image, Pressable, FlatList } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/summer-night-events.json";

const YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

type ProgramRow = {
  id: string; // event id
  title: string;
  imageUrl?: string;
  screeningDatetime: string; // ISO
  place: string;
  year: number;
};

const moviesById = new Map<number, any>(
  (moviesData as any).movies.map((m: any) => [m.id, m])
);

function formatDateTimeLabel(iso: string) {
  // version simple (on améliorera ensuite en "Sam. 12 juillet · 21h30")
  const [datePart, timePart] = iso.split("T");
  const time = (timePart ?? "").slice(0, 5); // HH:mm
  return `${datePart} · ${time}`;
}

export class SummerNightScreen extends Component<{}, { selectedYear: number }> {
  constructor(props: {}) {
    super(props);
    this.state = { selectedYear: 2026 };
  }

  renderYearChip = (year: number) => {
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

  render() {
    const rows: ProgramRow[] = (eventsData as any).summer_night_events.map(
      (event: any) => {
        const movie = moviesById.get(event.movie_id);

        return {
          id: String(event.id),
          title: movie?.name ?? "Film",
          imageUrl: movie?.image_url,
          screeningDatetime: event.screening_datetime,
          place: event.place,
          year: event.year,
        };
      }
    );

    const filteredRows = rows.filter((r) => r.year === this.state.selectedYear);

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
            <Text style={tw`text-lg font-bold text-slate-900`}>
                Cinéma plein air
            </Text>
            <Text style={tw`text-slate-500 text-xs`}>
                Programmation & archives
            </Text>
            </View>
        </View>
        </View>

        <FlatList
        data={filteredRows}
        keyExtractor={(item) => item.id}
        contentContainerStyle={tw`pb-6`}
        ItemSeparatorComponent={() => <View style={tw`h-px bg-slate-100 ml-4`} />}
        ListHeaderComponent={
            <View>
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
                    <Text style={tw`text-slate-900 font-extrabold tracking-wider`}>
                    ANNÉE
                    </Text>
                    <View style={tw`mt-3 flex-row flex-wrap`}>
                    {YEARS.map(this.renderYearChip)}
                    </View>
                </View>

                {/* TITRE PROGRAMME */}
                <View style={tw`mt-2 px-4 pb-2`}>
                    <Text style={tw`text-slate-900 font-extrabold tracking-wider`}>
                    PROGRAMME
                    </Text>
                </View>
            </View>
        }
        ListEmptyComponent={
            <View style={tw`px-4 py-12 items-center`}>
                <Ionicons name="time-outline" size={32} color="#94a3b8" />
                <Text style={tw`mt-4 text-slate-400 font-semibold text-base`}>
                Programmation à venir
                </Text>
                <Text style={tw`mt-1 text-slate-400 text-sm text-center`}>
                Les séances pour cette année seront annoncées prochainement.
                </Text>
            </View>
        }
        renderItem={({ item }) => (
            <View style={tw`px-4 py-3 flex-row items-center`}>
            {/* Poster */}
            <View style={tw`w-12 h-12 rounded-xl bg-slate-200 overflow-hidden`}>
                {item.imageUrl ? (
                <Image
                    source={{ uri: item.imageUrl }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                />
                ) : null}
            </View>

            {/* Infos */}
            <View style={tw`ml-3 flex-1`}>
                <Text style={tw`text-slate-900 font-bold`}>{item.title}</Text>

                <View style={tw`flex-row items-center mt-1`}>
                <Ionicons name="calendar-outline" size={14} color="#64748b" />
                <Text style={tw`ml-1 text-slate-500 text-xs`}>
                    {formatDateTimeLabel(item.screeningDatetime)}
                </Text>

                <View style={tw`w-3`} />

                <Ionicons name="location-outline" size={14} color="#64748b" />
                <Text style={tw`ml-1 text-slate-500 text-xs`} numberOfLines={1}>
                    {item.place}
                </Text>
                </View>
            </View>
            </View>
        )}
        />
    </View>
    );

  }
}
