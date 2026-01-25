import { Component } from "react";
import { View, Text, Image, FlatList, ListRenderItemInfo } from "react-native";
import tw from "twrnc";
import { router } from "expo-router";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/grindhouse-events.json"; // ✅ adapte le nom si besoin

import { ProgrammeItem } from "@/src/components/event/ProgrammeItem";
import { YearChips } from "@/src/components/event/YearChips";
import { EventListHeader } from "@/src/components/event/EventListHeader";

type Movie = {
  id: number;
  name: string;
  image_url?: string;
};

type GrindhouseEvent = {
  id: number;
  movie_ids: [number, number]; // ✅ double feature
  place: string;
  target_audience?: string;
  start_at: string;            // ✅ ISO datetime
  year?: number;
  price: number;               // ✅ prix affiché
  currency?: "EUR";
};

type Row = {
  eventId: number;
  title: string;
  imageUrl?: string;
  place: string;
  dateLabel: string;
  year: number;
  startsAt: string;
  price?: number;
  currency?: "EUR";
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

export class GrindhouseReadAllScreen extends Component<{}, { selectedYear: number }> {
  constructor(props: {}) {
    super(props);
    this.state = { selectedYear: 2026 };
  }

  private YEARS = [2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018];

  private moviesById = new Map<number, Movie>(
    (moviesData as any).movies.map((m: Movie) => [m.id, m])
  );

  private buildRows(): Row[] {
    // ✅ adapte la clé si ton JSON est "neighborhood_events" ou "grindhouse_events"
    const events: GrindhouseEvent[] =
      (eventsData as any).neighborhood_events ??
      (eventsData as any).grindhouse_events ??
      [];

    return events
      .map((event) => {
        const [m1, m2] = event.movie_ids;

        // Choix UI : afficher "Film 1 + Film 2"
        const movie1 = this.moviesById.get(m1);
        const movie2 = this.moviesById.get(m2);

        const title =
          movie1?.name && movie2?.name
            ? `${movie1.name} + ${movie2.name}`
            : movie1?.name ?? movie2?.name ?? "Double séance";

        // Choix UI : thumb = image du 1er film (simple)
        const imageUrl = movie1?.image_url ?? movie2?.image_url;

        const startsAt = event.start_at;
        const year = event.year ?? getYearFromIso(startsAt);

        return {
          eventId: event.id,
          title,
          imageUrl,
          place: event.place,
          startsAt,
          dateLabel: formatProgrammeLine(startsAt),
          year,
          price: event.price,
          currency: event.currency ?? "EUR",
        };
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }

  private renderProgrammeItem = ({ item }: ListRenderItemInfo<Row>) => {
    // ✅ Pour l’instant ProgrammeItem n’affiche pas le prix.
    // On va l’ajouter au prochain step (sans casser SummerNight).
    // Ici, on te met un suffix dans le "place" pour voir le prix direct.
    const placeWithPrice =
      typeof item.price === "number"
        ? `${item.place} · ${item.price} ${item.currency ?? "EUR"}`
        : item.place;

    return (
      <ProgrammeItem
        title={item.title}
        imageUrl={item.imageUrl}
        dateLabel={item.dateLabel}
        place={placeWithPrice}
        onPress={() =>
          router.push({
            pathname: "/(event)/grindhouse/[eventId]",
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
          title="Cinéma de quartier"
          subtitle="Double séance & infos pratiques"
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
                    uri: "https://images.unsplash.com/photo-1517602302552-471fe67acf66?auto=format&fit=crop&w=1200&q=60",
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
