import { Component } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  Image,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import moviesData from "../../../assets/movies.json";
import summerNightData from "../../../assets/summer-night-events.json";
import grindhouseData from "../../../assets/grindhouse-events.json";

/* =======================
   TYPES
======================= */

type Movie = {
  id: number;
  name: string;
  image_url?: string;
};

type SummerNightEvent = {
  id: number;
  place: string;
  screening_datetime: string; // ISO
  year?: number;

  // ✅ si tu ajoutes un titre dans tes données un jour, il sera utilisé
  title?: string;
  name?: string;
};

type GrindhouseEvent = {
  id: number;
  title: string; // ✅ déjà présent
  tag?: string;
  start_at: string; // ISO
  place: string;
  movie_ids: [number, number];
  background_image_url?: string;
};

type PlanningItem = {
  key: string;
  kind: "summer_night" | "grindhouse";
  eventId: number;

  title: string; // ✅ TITRE EVENT (pas film)
  imageUrl?: string;
  place: string;

  startsAt: string;
  dateLabel: string;
};

type PlanningSection = {
  title: string;
  dateKey: string;
  data: PlanningItem[];
};

/* =======================
   HELPERS
======================= */

function formatLine(iso: string) {
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

function formatSectionTitle(iso: string) {
  const d = new Date(iso);
  const weekday = d.toLocaleDateString("fr-FR", { weekday: "short" });
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleDateString("fr-FR", { month: "long" });

  const weekdayCap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const monthCap = month.charAt(0).toUpperCase() + month.slice(1);

  return `${weekdayCap} ${day} ${monthCap}`;
}

function dateKey(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isFutureOrToday(iso: string) {
  // ✅ Filtre "à partir de maintenant"
  return new Date(iso).getTime() >= Date.now();
}

/* =======================
   SCREEN
======================= */

export class ScheduleScreen extends Component<{}, { mode: "festival" | "my" }> {
  constructor(props: any) {
    super(props);
    this.state = { mode: "festival" };
  }

  private moviesById = new Map<number, Movie>(
    (moviesData as any).movies.map((m: Movie) => [m.id, m])
  );

  // 🔹 fake planning utilisateur (plus tard AsyncStorage)
  private myPlanning = new Set<string>(["summer:1", "grindhouse:1"]);

  private buildItems(): PlanningItem[] {
    const items: PlanningItem[] = [];

    /* ---- Plein air (Summer Night) ---- */
    const summerEvents: SummerNightEvent[] =
      (summerNightData as any).summer_night_events ?? [];

    summerEvents.forEach((e) => {
      // ✅ Filtre futur
      if (!isFutureOrToday(e.screening_datetime)) return;

      // ✅ Titre EVENT (pas film)
      // -> tes données plein air n’ont pas "title", donc fallback clair
      const eventTitle =
        e.title ??
        e.name ??
        "Cinéma plein air";

      // ✅ image : on peut garder l’image du film pour le thumb
      // (mais le texte = event)
      const movie = (e as any).movie_id
        ? this.moviesById.get((e as any).movie_id)
        : undefined;

      items.push({
        key: `summer:${e.id}`,
        kind: "summer_night",
        eventId: e.id,
        title: eventTitle,
        imageUrl: movie?.image_url,
        place: e.place,
        startsAt: e.screening_datetime,
        dateLabel: formatLine(e.screening_datetime),
      });
    });

    /* ---- Cinéma de quartier (Grindhouse) ---- */
    const grindhouseEvents: GrindhouseEvent[] =
      (grindhouseData as any).neighborhood_events ??
      (grindhouseData as any).grindhouse_events ??
      [];

    grindhouseEvents.forEach((e) => {
      // ✅ Filtre futur
      if (!isFutureOrToday(e.start_at)) return;

      // ✅ Titre EVENT (déjà présent)
      const eventTitle = e.title ?? "Cinéma de quartier";

      // ✅ image : on garde une image de film ou background event
      const movie1 = this.moviesById.get(e.movie_ids?.[0]);
      const movie2 = this.moviesById.get(e.movie_ids?.[1]);

      items.push({
        key: `grindhouse:${e.id}`,
        kind: "grindhouse",
        eventId: e.id,
        title: eventTitle,
        imageUrl: movie1?.image_url ?? movie2?.image_url ?? e.background_image_url,
        place: e.place,
        startsAt: e.start_at,
        dateLabel: formatLine(e.start_at),
      });
    });

    // tri chronologique
    return items.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }

  private buildSections(items: PlanningItem[]): PlanningSection[] {
    const map = new Map<string, PlanningSection>();

    items.forEach((item) => {
      const key = dateKey(item.startsAt);

      if (!map.has(key)) {
        map.set(key, {
          title: formatSectionTitle(item.startsAt),
          dateKey: key,
          data: [],
        });
      }
      map.get(key)!.data.push(item);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.dateKey.localeCompare(b.dateKey)
    );
  }

  private getSections(): PlanningSection[] {
    const all = this.buildItems();

    if (this.state.mode === "festival") {
      return this.buildSections(all);
    }

    const mine = all.filter((i) => this.myPlanning.has(i.key));
    return this.buildSections(mine);
  }

  private renderItem = ({ item }: { item: PlanningItem }) => {
    return (
      <Pressable
        onPress={() => {
          router.push({
            pathname:
              item.kind === "summer_night"
                ? "/(event)/summer_night/[eventId]"
                : "/(event)/grindhouse/[eventId]",
            params: { eventId: String(item.eventId) },
          });
        }}
        style={({ pressed }) =>
          tw`mx-4 mb-3 p-3 rounded-2xl border border-slate-100 bg-white flex-row ${
            pressed ? "opacity-95" : "opacity-100"
          }`
        }
      >
        <View style={tw`w-12 h-12 rounded-xl overflow-hidden bg-slate-200`}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : null}
        </View>

        <View style={tw`ml-3 flex-1`}>
          {/* ✅ TITRE EVENT */}
          <Text style={tw`font-bold text-slate-900`} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={tw`mt-2 flex-row items-center flex-wrap`}>
            <View style={tw`flex-row items-center mr-4`}>
              <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
              <Text style={tw`ml-1 text-slate-500 text-xs`}>
                {item.dateLabel}
              </Text>
            </View>

            <View style={tw`flex-row items-center`}>
              <Ionicons name="location-outline" size={14} color="#94a3b8" />
              <Text style={tw`ml-1 text-slate-500 text-xs`} numberOfLines={1}>
                {item.place}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  render() {
    const sections = this.getSections();

    return (
      <View style={tw`flex-1 bg-white`}>
        {/* Header */}
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
              <Text style={tw`text-lg font-bold text-slate-900`}>Planning</Text>
              <Text style={tw`text-slate-500 text-xs`}>
                Diffusions proches de chez vous
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={tw`px-4 mt-2`}>
          <View style={tw`bg-slate-50 rounded-2xl p-1 flex-row`}>
            <Pressable
              onPress={() => this.setState({ mode: "my" })}
              style={({ pressed }) =>
                tw`flex-1 py-2 rounded-xl items-center justify-center ${
                  this.state.mode === "my"
                    ? "bg-white"
                    : pressed
                    ? "bg-slate-100"
                    : "bg-transparent"
                }`
              }
            >
              <Text
                style={tw`${
                  this.state.mode === "my"
                    ? "text-slate-900 font-semibold"
                    : "text-slate-500 font-medium"
                }`}
              >
                Mon planning
              </Text>
            </Pressable>

            <Pressable
              onPress={() => this.setState({ mode: "festival" })}
              style={({ pressed }) =>
                tw`flex-1 py-2 rounded-xl items-center justify-center ${
                  this.state.mode === "festival"
                    ? "bg-white"
                    : pressed
                    ? "bg-slate-100"
                    : "bg-transparent"
                }`
              }
            >
              <Text
                style={tw`${
                  this.state.mode === "festival"
                    ? "text-slate-900 font-semibold"
                    : "text-slate-500 font-medium"
                }`}
              >
                Planning du festival
              </Text>
            </Pressable>
          </View>
        </View>

        {/* List */}
        <SectionList
          sections={sections}
          keyExtractor={(it) => it.key}
          renderItem={this.renderItem}
          renderSectionHeader={({ section }) => (
            <Text style={tw`mx-4 mt-3 mb-2 text-slate-600 italic`}>
              {section.title}
            </Text>
          )}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pt-2 pb-20`}
          ListEmptyComponent={
            <View style={tw`px-4 py-8`}>
              <Text style={tw`text-slate-900 font-bold`}>
                Aucune diffusion à venir
              </Text>
              <Text style={tw`mt-2 text-slate-600`}>
                Revenez plus tard pour découvrir les prochaines séances.
              </Text>
            </View>
          }
        />
      </View>
    );
  }
}
