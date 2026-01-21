import { Component } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ListRenderItemInfo,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/summer-night-events.json";

type Movie = {
  id: number;
  name: string;
  image_url?: string;
};

type SummerNightEvent = {
  id: number;
  movie_id: number;
  place: string;
  target_audience?: string;
  screening_datetime: string;
  year?: number;
};

type Row = {
  eventId: number;
  title: string;
  imageUrl?: string;
  place: string;
  dateLabel: string;
  year: number;
};

function getYearFromIso(iso: string) {
  return new Date(iso).getFullYear();
}

function formatProgrammeLine(iso: string) {
  const d = new Date(iso);

  const day = d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });

  const time = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // "Sam. 12 juillet · 21h30"
  return `${day} · ${time.replace(":", "h")}`;
}

export class SummerNightReadAllScreen extends Component<
  {},
  { selectedYear: number }
> {
  constructor(props: {}) {
    super(props);
    this.state = { selectedYear: 2026 };
  }

  private YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  private moviesById = new Map<number, Movie>(
    (moviesData as any).movies.map((m: Movie) => [m.id, m])
  );

  private buildRows(): Row[] {
    const events: SummerNightEvent[] = (eventsData as any).summer_night_events;

    return events
      .map((event) => {
        const movie = this.moviesById.get(event.movie_id);
        const year = event.year ?? getYearFromIso(event.screening_datetime);

        return {
          eventId: event.id,
          title: movie?.name ?? "Film",
          imageUrl: movie?.image_url,
          place: event.place,
          dateLabel: formatProgrammeLine(event.screening_datetime),
          year,
        };
      })
      .sort(
        (a, b) =>
          new Date(
            (eventsData as any).summer_night_events.find((e: any) => e.id === a.eventId)
              ?.screening_datetime ?? 0
          ).getTime() -
          new Date(
            (eventsData as any).summer_night_events.find((e: any) => e.id === b.eventId)
              ?.screening_datetime ?? 0
          ).getTime()
      );
  }

  private renderYearChip = (year: number) => {
    const active = year === this.state.selectedYear;
    return (
      <Pressable
        key={year}
        onPress={() => this.setState({ selectedYear: year })}
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
        <Text style={tw`font-semibold ${active ? "text-white" : "text-slate-900"}`}>
          {year}
        </Text>
      </Pressable>
    );
  };

  private renderProgrammeItem = ({ item }: ListRenderItemInfo<Row>) => {
    return (
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/(event)/summer_night/[eventId]",
            params: { eventId: String(item.eventId) },
          })
        }
        style={({ pressed }) =>
          tw`px-4 py-3 flex-row items-center ${
            pressed ? "bg-slate-50" : "bg-white"
          }`
        }
      >
        {/* Thumb */}
        <View style={tw`w-12 h-12 rounded-lg overflow-hidden bg-slate-200`}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : null}
        </View>

        {/* Texts */}
        <View style={tw`flex-1 ml-3`}>
          <Text style={tw`text-slate-900 font-bold`} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={tw`mt-1 flex-row items-center flex-wrap`}>
            <View style={tw`flex-row items-center mr-4`}>
              <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
              <Text style={tw`ml-1 text-slate-400 text-xs`}>
                {item.dateLabel}
              </Text>
            </View>

            <View style={tw`flex-row items-center`}>
              <Ionicons name="location-outline" size={14} color="#94a3b8" />
              <Text style={tw`ml-1 text-slate-400 text-xs`} numberOfLines={1}>
                {item.place}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  render() {
    const rows = this.buildRows();
    const filtered = rows.filter((r) => r.year === this.state.selectedYear);

    return (
      <View style={tw`flex-1 bg-white`}>
        {/* HEADER fixe */}
        <View style={tw`px-4 pt-4 pb-2`}>
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

        {/* ✅ Une seule zone scroll : FlatList */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.eventId)}
          renderItem={this.renderProgrammeItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={tw`h-px bg-slate-100 ml-4`} />
          )}
          contentContainerStyle={tw`pb-16`}
          ListHeaderComponent={
            <>
              {/* HERO */}
              <View style={tw`mt-2 px-4`}>
                <Image
                  source={{
                    uri: "https://strasbourgfestival.com/wp-content/uploads/2024/06/CPA2025_banner_700x370.png",
                  }}
                  resizeMode="cover"
                  style={tw`w-full h-40 rounded-2xl`}
                />
              </View>

              {/* YEAR FILTER */}
              <View style={tw`mt-4 px-4`}>
                <Text style={tw`text-slate-900 font-extrabold tracking-wider`}>
                  ANNÉE
                </Text>
                <View style={tw`mt-3 flex-row flex-wrap`}>
                  {this.YEARS.map(this.renderYearChip)}
                </View>
              </View>

              {/* PROGRAMME title */}
              <View style={tw`mt-4`}>
                <Text style={tw`px-4 text-slate-900 font-extrabold tracking-wider text-xs`}>
                  PROGRAMME
                </Text>
                <View style={tw`mt-3 h-px bg-slate-100`} />
              </View>

              {/* Empty state */}
              {filtered.length === 0 && (
                <View style={tw`px-4 py-6`}>
                  <Text style={tw`text-slate-900 font-bold`}>
                    Programmation bientôt disponible
                  </Text>
                  <Text style={tw`mt-2 text-slate-600`}>
                    Aucune projection annoncée pour {this.state.selectedYear}.
                  </Text>
                </View>
              )}
            </>
          }
          // si aucun film, on n'affiche rien en liste (déjà géré par empty state)
          ListEmptyComponent={null}
        />
      </View>
    );
  }
}