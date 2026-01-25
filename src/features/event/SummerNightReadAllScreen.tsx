import { Component } from "react";
import { View, Text, Image, FlatList, ListRenderItemInfo } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/summer-night-events.json";

import { ProgrammeItem } from "@/src/components/event/ProgrammeItem";
import { YearChips } from "@/src/components/event/YearChips";
import { EventListHeader } from "@/src/components/event/EventListHeader";

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
  startsAt: string;
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

  return `${day} · ${time.replace(":", "h")}`;
}

export class SummerNightReadAllScreen extends Component<{}, { selectedYear: number }> {
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
          startsAt: event.screening_datetime,
          dateLabel: formatProgrammeLine(event.screening_datetime),
          year,
        };
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }

  private renderProgrammeItem = ({ item }: ListRenderItemInfo<Row>) => {
    return (
      <ProgrammeItem
        title={item.title}
        imageUrl={item.imageUrl}
        dateLabel={item.dateLabel}
        place={item.place}
        onPress={() =>
          router.push({
            pathname: "/(event)/summer_night/[eventId]",
            params: { eventId: String(item.eventId) },
          })
        }
      />
    );
  };

  render() {
    const rows = this.buildRows();
    const filtered = rows.filter((r) => r.year === this.state.selectedYear);

    return (
      <View style={tw`flex-1 bg-white`}>
        <EventListHeader
          title="Cinéma plein air"
          subtitle="Programmation & archives"
          onBack={() => router.back()}
        />

        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.eventId)}
          renderItem={this.renderProgrammeItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={tw`h-px bg-slate-100 ml-4`} />}
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

                <View style={tw`mt-3`}>
                  <YearChips
                    years={this.YEARS}
                    selectedYear={this.state.selectedYear}
                    onSelectYear={(year) => this.setState({ selectedYear: year })}
                  />
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
          ListEmptyComponent={null}
        />
      </View>
    );
  }
}
