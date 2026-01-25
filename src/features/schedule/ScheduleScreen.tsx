import React, { Component } from "react";
import {
  View,
  Text,
  Pressable,
  SectionList,
  Image,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moviesData from "../../../assets/movies.json";
import summerNightData from "../../../assets/summer-night-events.json";
import grindhouseData from "../../../assets/grindhouse-events.json";
import { ThemeContext } from "@/src/context/ThemeContext";

const STORAGE_KEY = "@festival_planning";

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
  screening_datetime: string;
  title?: string;
  name?: string;
};

type GrindhouseEvent = {
  id: number;
  title: string;
  tag?: string;
  start_at: string;
  place: string;
  movie_ids: [number, number];
  background_image_url?: string;
};

type PlanningItem = {
  key: string;
  kind: "summer_night" | "grindhouse";
  eventId: number;
  title: string;
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
  return new Date(iso).getTime() >= Date.now();
}

/* =======================
   SCREEN
======================= */

type State = {
  mode: "festival" | "my";
  myPlanning: Set<string>;
  loading: boolean;
};

export class ScheduleScreen extends Component<{}, State> {
  static contextType = ThemeContext;

  constructor(props: any) {
    super(props);
    this.state = {
      mode: "festival",
      myPlanning: new Set(),
      loading: true,
    };
  }

  componentDidMount() {
    this.loadPlanning();
    // Recharger toutes les 500ms pour détecter les changements
    this.interval = setInterval(() => {
      this.loadPlanning();
    }, 500);
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private interval: any;

  private loadPlanning = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const planningArray = JSON.parse(stored);
        this.setState({ myPlanning: new Set(planningArray) });
      }
    } catch (error) {
      console.error("Erreur chargement planning:", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  private moviesById = new Map<number, Movie>(
      (moviesData as any).movies.map((m: Movie) => [m.id, m])
  );

  private buildItems(): PlanningItem[] {
    const items: PlanningItem[] = [];

    const summerEvents: SummerNightEvent[] =
        (summerNightData as any).summer_night_events ?? [];

    summerEvents.forEach((e) => {
      if (!isFutureOrToday(e.screening_datetime)) return;

      const eventTitle = e.title ?? e.name ?? "Cinéma plein air";
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

    const grindhouseEvents: GrindhouseEvent[] =
        (grindhouseData as any).neighborhood_events ??
        (grindhouseData as any).grindhouse_events ??
        [];

    grindhouseEvents.forEach((e) => {
      if (!isFutureOrToday(e.start_at)) return;

      const eventTitle = e.title ?? "Cinéma de quartier";
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

    const mine = all.filter((i) => this.state.myPlanning.has(i.key));
    return this.buildSections(mine);
  }

  private renderItem = ({ item }: { item: PlanningItem }) => {
    const { theme } = this.context as any;
    const isDark = theme === "dark";

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
            style={({ pressed }) => [
              tw`mx-4 mb-3 p-3 rounded-2xl flex-row`,
              {
                backgroundColor: isDark ? "#020617" : "#ffffff",
                borderWidth: 1,
                borderColor: isDark ? "#1f2937" : "#e5e7eb",
                opacity: pressed ? 0.95 : 1,
              },
            ]}
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
            <Text
                style={[
                  tw`font-bold`,
                  { color: isDark ? "#f9fafb" : "#0f172a" },
                ]}
                numberOfLines={1}
            >
              {item.title}
            </Text>

            <View style={tw`mt-2 flex-row items-center flex-wrap`}>
              <View style={tw`flex-row items-center mr-4`}>
                <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={isDark ? "#9ca3af" : "#94a3b8"}
                />
                <Text
                    style={[
                      tw`ml-1 text-xs`,
                      { color: isDark ? "#9ca3af" : "#6b7280" },
                    ]}
                >
                  {item.dateLabel}
                </Text>
              </View>

              <View style={tw`flex-row items-center`}>
                <Ionicons
                    name="location-outline"
                    size={14}
                    color={isDark ? "#9ca3af" : "#94a3b8"}
                />
                <Text
                    style={[
                      tw`ml-1 text-xs`,
                      { color: isDark ? "#9ca3af" : "#6b7280" },
                    ]}
                    numberOfLines={1}
                >
                  {item.place}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
    );
  };

  render() {
    const { theme } = this.context as any;
    const isDark = theme === "dark";

    if (this.state.loading) {
      return (
          <View
              style={[
                tw`flex-1 items-center justify-center`,
                { backgroundColor: isDark ? "#0F172A" : "#ffffff" },
              ]}
          >
            <ActivityIndicator size="large" color="#f97316" />
          </View>
      );
    }

    const sections = this.getSections();

    return (
        <View
            style={[
              tw`flex-1`,
              { backgroundColor: isDark ? "#0F172A" : "#ffffff" },
            ]}
        >
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
                <Ionicons
                    name="chevron-back"
                    size={22}
                    color={isDark ? "#e5e7eb" : "#0f172a"}
                />
              </Pressable>

              <View style={tw`ml-2`}>
                <Text
                    style={[
                      tw`text-lg font-bold`,
                      { color: isDark ? "#e5e7eb" : "#0f172a" },
                    ]}
                >
                  Planning
                </Text>
                <Text
                    style={[
                      tw`text-xs`,
                      { color: isDark ? "#9ca3af" : "#6b7280" },
                    ]}
                >
                  Diffusions proches de chez vous
                </Text>
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={tw`px-4 mt-2`}>
            <View
                style={[
                  tw`rounded-2xl p-1 flex-row`,
                  { backgroundColor: isDark ? "#020617" : "#f9fafb" },
                ]}
            >
              <Pressable
                  onPress={() => this.setState({ mode: "my" })}
                  style={({ pressed }) => [
                    tw`flex-1 py-2 rounded-xl items-center justify-center`,
                    this.state.mode === "my"
                        ? {
                          backgroundColor: isDark ? "#ffffff" : "#ffffff",
                        }
                        : pressed
                            ? { backgroundColor: isDark ? "#111827" : "#e5e7eb" }
                            : { backgroundColor: "transparent" },
                  ]}
              >
                <Text
                    style={[
                      this.state.mode === "my"
                          ? tw`font-semibold`
                          : tw`font-medium`,
                      {
                        color:
                            this.state.mode === "my"
                                ? "#0f172a"
                                : isDark
                                    ? "#9ca3af"
                                    : "#6b7280",
                      },
                    ]}
                >
                  Mon planning
                </Text>
              </Pressable>

              <Pressable
                  onPress={() => this.setState({ mode: "festival" })}
                  style={({ pressed }) => [
                    tw`flex-1 py-2 rounded-xl items-center justify-center`,
                    this.state.mode === "festival"
                        ? {
                          backgroundColor: isDark ? "#ffffff" : "#ffffff",
                        }
                        : pressed
                            ? { backgroundColor: isDark ? "#111827" : "#e5e7eb" }
                            : { backgroundColor: "transparent" },
                  ]}
              >
                <Text
                    style={[
                      this.state.mode === "festival"
                          ? tw`font-semibold`
                          : tw`font-medium`,
                      {
                        color:
                            this.state.mode === "festival"
                                ? "#0f172a"
                                : isDark
                                    ? "#9ca3af"
                                    : "#6b7280",
                      },
                    ]}
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
                  <Text
                      style={[
                        tw`mx-4 mt-3 mb-2 italic`,
                        { color: isDark ? "#9ca3af" : "#4b5563" },
                      ]}
                  >
                    {section.title}
                  </Text>
              )}
              stickySectionHeadersEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={tw`pt-2 pb-20`}
              ListEmptyComponent={
                <View style={tw`px-4 py-8`}>
                  <Text
                      style={[
                        tw`font-bold`,
                        { color: isDark ? "#e5e7eb" : "#0f172a" },
                      ]}
                  >
                    Aucune diffusion à venir
                  </Text>
                  <Text
                      style={[
                        tw`mt-2`,
                        { color: isDark ? "#9ca3af" : "#4b5563" },
                      ]}
                  >
                    {this.state.mode === "my"
                        ? "Ajoutez des événements à votre planning pour les retrouver ici."
                        : "Revenez plus tard pour découvrir les prochaines séances."}
                  </Text>
                </View>
              }
          />
        </View>
    );
  }
}