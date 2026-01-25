import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput, FlatList, Image } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";

import moviesData from "../../../assets/movies.json";
import summerNightData from "../../../assets/summer-night-events.json";
import grindhouseData from "../../../assets/grindhouse-events.json";

type Movie = {
    id: number;
    name: string;
    image_url?: string;
};

type SummerNightEvent = {
    id: number;
    place: string;
    screening_datetime: string;
    movie_id?: number;
};

type GrindhouseEvent = {
    id: number;
    title: string;
    start_at: string;
    place: string;
    movie_ids?: number[];
    background_image_url?: string;
};

type SearchCategory = "all" | "projection" | "event";

type SearchItem = {
    key: string;
    kind: "summer_night" | "grindhouse";
    category: SearchCategory;
    eventId: number;
    title: string;
    place: string;
    startsAt: string;
    dateLabel: string;
    dateDayLabel: string;
    timeLabel: string;
    imageUrl?: string;
};

function isFutureOrToday(iso: string) {
    return new Date(iso).getTime() >= Date.now();
}

function formatDateParts(iso: string) {
    const d = new Date(iso);

    const dateDayLabel = d
        .toLocaleDateString("fr-FR", { day: "2-digit", month: "long" })
        .toUpperCase();

    const timeLabel = d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const dateLabel = d.toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "long",
    });

    return { dateDayLabel, timeLabel, dateLabel };
}

const SearchScreen: React.FC = () => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState<SearchCategory>("all");

    const navigation = useNavigation();

    const handleBack = () => {
        if (navigation.canGoBack && navigation.canGoBack()) {
            navigation.goBack();
        } else {
            router.replace("/(home)");
        }
    };

    const moviesById = useMemo(
        () =>
            new Map<number, Movie>(
                // @ts-ignore
                moviesData.movies.map((m: Movie) => [m.id, m])
            ),
        []
    );

    const allItems: SearchItem[] = useMemo(() => {
        const items: SearchItem[] = [];

        const summerEvents: SummerNightEvent[] =
            summerNightData.summer_night_events ?? [];

        summerEvents.forEach((e) => {
            if (!isFutureOrToday(e.screening_datetime)) return;

            const movie =
                e.movie_id !== undefined ? moviesById.get(e.movie_id) : undefined;
            const { dateDayLabel, timeLabel, dateLabel } = formatDateParts(
                e.screening_datetime
            );

            items.push({
                key: `summer:${e.id}`,
                kind: "summer_night",
                category: "projection",
                eventId: e.id,
                title: movie?.name ?? "Cinéma plein air",
                place: e.place,
                startsAt: e.screening_datetime,
                dateLabel,
                dateDayLabel,
                timeLabel,
                imageUrl: movie?.image_url,
            });
        });

        const grindhouseEvents: GrindhouseEvent[] =
            grindhouseData.neighborhood_events ??
            // @ts-ignore
            grindhouseData.grindhouse_events ??
            [];

        grindhouseEvents.forEach((e) => {
            if (!isFutureOrToday(e.start_at)) return;

            const firstMovieId = e.movie_ids?.[0];
            const movie = firstMovieId ? moviesById.get(firstMovieId) : undefined;
            const { dateDayLabel, timeLabel, dateLabel } = formatDateParts(
                e.start_at
            );

            items.push({
                key: `grindhouse:${e.id}`,
                kind: "grindhouse",
                category: "event",
                eventId: e.id,
                title: e.title,
                place: e.place,
                startsAt: e.start_at,
                dateLabel,
                dateDayLabel,
                timeLabel,
                imageUrl: movie?.image_url ?? e.background_image_url,
            });
        });

        return items.sort(
            (a, b) =>
                new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
        );
    }, [moviesById]);

    const filteredItems = useMemo(() => {
        const q = query.trim().toLowerCase();

        return allItems.filter((item) => {
            if (category === "projection" && item.category !== "projection")
                return false;
            if (category === "event" && item.category !== "event") return false;

            if (!q) return true;

            const haystack = (
                item.title +
                " " +
                item.place +
                " " +
                item.dateLabel +
                " " +
                item.dateDayLabel
            )
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            const needle = q
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            return haystack.includes(needle);
        });
    }, [allItems, category, query]);

    const handlePressItem = (item: SearchItem) => {
        router.push({
            pathname:
                item.kind === "summer_night"
                    ? "/(event)/summer_night/[eventId]"
                    : "/(event)/grindhouse/[eventId]",
            params: { eventId: String(item.eventId) },
        });
    };

    const renderItem = ({ item }: { item: SearchItem }) => (
        <Pressable
            onPress={() => handlePressItem(item)}
            style={({ pressed }) =>
                tw`flex-row items-center justify-between px-4 py-3 ${
                    pressed ? "opacity-90" : "opacity-100"
                }`
            }
        >
            <View style={tw`flex-row items-center flex-1`}>
                <View
                    style={tw`w-14 h-14 rounded-2xl overflow-hidden bg-slate-200`}
                >
                    {item.imageUrl ? (
                        <Image
                            source={{ uri: item.imageUrl }}
                            style={tw`w-full h-full`}
                            resizeMode="cover"
                        />
                    ) : null}
                </View>

                <View style={tw`ml-3 flex-1`}>
                    <View style={tw`flex-row items-center`}>
                        <Ionicons
                            name="location-outline"
                            size={12}
                            color="#f97316"
                        />
                        <Text
                            style={tw`ml-1 text-sm font-semibold text-slate-900`}
                            numberOfLines={2}
                        >
                            {item.place}
                        </Text>
                    </View>

                    <Text
                        style={tw`mt-1 text-xs text-slate-500`}
                        numberOfLines={1}
                    >
                        {item.title}
                    </Text>
                </View>
            </View>

            <View style={tw`items-end ml-3`}>
                <Text style={tw`text-xs font-semibold text-orange-600`}>
                    {item.dateDayLabel}
                </Text>
                <Text style={tw`mt-1 text-xs text-slate-600`}>
                    à {item.timeLabel}
                </Text>
            </View>
        </Pressable>
    );

    return (
        <View style={tw`flex-1 bg-[#fafafa]`}>
            <View style={tw`px-4 pt-6 pb-3 flex-row items-center`}>
                <Pressable
                    onPress={handleBack}
                    style={tw`w-10 h-10 rounded-full items-center justify-center mr-2`}
                    hitSlop={10}
                >
                    <Ionicons name="chevron-back" size={22} color="#0f172a" />
                </Pressable>

                <Text style={tw`text-lg font-semibold text-slate-900`}>
                    Recherche
                </Text>
            </View>

            <View style={tw`px-4`}>
                <View
                    style={tw`flex-row items-center bg-white rounded-2xl px-3 py-2 border border-slate-200`}
                >
                    <Ionicons name="search-outline" size={18} color="#9ca3af" />
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Rechercher un lieu, un nom, une date…"
                        placeholderTextColor="#9ca3af"
                        style={tw`ml-2 flex-1 text-sm text-slate-900`}
                    />
                    {query.length > 0 && (
                        <Pressable onPress={() => setQuery("")} hitSlop={10}>
                            <Ionicons
                                name="close-circle"
                                size={18}
                                color="#f97316"
                            />
                        </Pressable>
                    )}
                </View>
            </View>

            <View style={tw`px-4 mt-4`}>
                <View style={tw`flex-row`}>
                    <Pressable
                        onPress={() => setCategory("all")}
                        style={tw`flex-row items-center px-4 py-2 rounded-2xl mr-2 ${
                            category === "all" ? "bg-orange-600" : "bg-white"
                        }`}
                    >
                        <Ionicons
                            name="grid-outline"
                            size={16}
                            color={category === "all" ? "#fff" : "#f97316"}
                        />
                        <Text
                            style={tw`ml-2 text-xs font-semibold ${
                                category === "all"
                                    ? "text-white"
                                    : "text-slate-900"
                            }`}
                        >
                            Tous
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setCategory("projection")}
                        style={tw`flex-row items-center px-4 py-2 rounded-2xl mr-2 ${
                            category === "projection"
                                ? "bg-orange-600"
                                : "bg-white"
                        }`}
                    >
                        <Ionicons
                            name="film-outline"
                            size={16}
                            color={
                                category === "projection" ? "#fff" : "#f97316"
                            }
                        />
                        <Text
                            style={tw`ml-2 text-xs font-semibold ${
                                category === "projection"
                                    ? "text-white"
                                    : "text-slate-900"
                            }`}
                        >
                            Projections
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setCategory("event")}
                        style={tw`flex-row items-center px-4 py-2 rounded-2xl ${
                            category === "event" ? "bg-orange-600" : "bg-white"
                        }`}
                    >
                        <Ionicons
                            name="sparkles-outline"
                            size={16}
                            color={category === "event" ? "#fff" : "#f97316"}
                        />
                        <Text
                            style={tw`ml-2 text-xs font-semibold ${
                                category === "event"
                                    ? "text-white"
                                    : "text-slate-900"
                            }`}
                        >
                            Événements
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View style={tw`mt-5 flex-1`}>
                <Text
                    style={tw`px-4 mb-2 text-xs font-semibold text-slate-500`}
                >
                    RÉSULTATS DE RECHERCHE
                </Text>

                <FlatList
                    data={filteredItems}
                    keyExtractor={(item) => item.key}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => (
                        <View style={tw`h-px bg-slate-100 mx-4`} />
                    )}
                    contentContainerStyle={tw`pb-6`}
                    ListEmptyComponent={
                        <View style={tw`px-4 mt-6`}>
                            <Text style={tw`text-sm text-slate-500`}>
                                Aucun résultat pour « {query} ».
                            </Text>
                        </View>
                    }
                />
            </View>
        </View>
    );
};

export default SearchScreen;