import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Linking,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/grindhouse-events.json";

const STORAGE_KEY = "@festival_planning";

type Movie = {
  id: number;
  name: string;
  image_url?: string;
  poster_url?: string;
  synopsis?: string;
  description?: string;

  year?: number;
  duration_min?: number;
  duration?: string;

  director?: string;
  cast?: string[];

  genre?: string;
  genres?: string[];

  version?: string;
};

type GrindhouseEvent = {
  id: number;
  name?: string;
  title?: string;

  place: string;
  start_at: string;
  year?: number;

  price: number;
  currency?: "EUR";

  movie_ids: [number, number];

  background_image_url?: string;
  youtube_url?: string;

  ticketing_url?: string;
  accessibility?: string[];
  practical_info?: string[];
};

function getYearFromIso(iso: string) {
  return new Date(iso).getFullYear();
}

function formatEventBadge(iso: string) {
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

function normalizeMovie(m: any): Movie {
  return {
    id: m.id,
    name: m.name ?? m.title ?? "Film",
    image_url: m.image_url ?? m.cover_url ?? m.backdrop_url,
    poster_url: m.poster_url ?? m.poster,
    synopsis: m.synopsis ?? m.description,
    description: m.description,

    year: m.year,
    duration_min: m.duration_min ?? m.runtime ?? m.runtime_min,
    duration: m.duration,

    director: m.director ?? m.realisateur ?? m.directed_by,
    cast: m.cast ?? m.actors ?? m.with,

    genre: m.genre,
    genres: m.genres,

    version: m.version ?? m.language_version,
  };
}

function formatDuration(movie: Movie) {
  if (typeof movie.duration_min === "number") {
    const h = Math.floor(movie.duration_min / 60);
    const min = movie.duration_min % 60;
    if (h > 0) return `${h}h${String(min).padStart(2, "0")}`;
    return `${min} min`;
  }
  if (movie.duration) return movie.duration;
  return undefined;
}

function joinGenres(movie: Movie) {
  if (Array.isArray(movie.genres) && movie.genres.length > 0) return movie.genres.join(", ");
  if (movie.genre) return movie.genre;
  return undefined;
}

function Pill({ text }: { text: string }) {
  return (
    <View style={tw`mr-2 mb-2 px-3 py-1 rounded-full bg-slate-100`}>
      <Text style={tw`text-slate-900 text-xs font-semibold`}>{text}</Text>
    </View>
  );
}

function MovieCarouselPage({ movie }: { movie: Movie }) {
  const synopsis = movie.synopsis ?? movie.description;
  const duration = formatDuration(movie);
  const genres = joinGenres(movie);
  const director = movie.director;
  const cast =
    Array.isArray(movie.cast) && movie.cast.length > 0 ? movie.cast.join(", ") : undefined;

  return (
    <View style={tw`w-full`}>
      <View style={tw`px-4`}>
        <View style={tw`w-full h-56 rounded-2xl overflow-hidden bg-slate-800`}>
          {movie.image_url || movie.poster_url ? (
            <Image
              source={{ uri: (movie.image_url ?? movie.poster_url)! }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : null}
        </View>
      </View>

      <Text style={tw`mt-4 px-4 text-slate-200 font-extrabold tracking-wider`}>
        {(movie.name ?? "FILM").toUpperCase()}
      </Text>

      {synopsis ? (
        <Text style={tw`mt-2 px-4 text-slate-300 leading-5`}>
          {synopsis}
        </Text>
      ) : null}

      <Text style={tw`mt-5 px-4 text-slate-200 font-extrabold tracking-wider text-xs`}>
        FICHE TECHNIQUE
      </Text>

      <View style={tw`mt-3 px-4 flex-row flex-wrap`}>
        {movie.year ? <Pill text={`${movie.year}`} /> : null}
        {duration ? <Pill text={duration} /> : null}
      </View>

      <View style={tw`px-4 flex-row flex-wrap`}>
        {director ? <Pill text={`Réalisation : ${director}`} /> : null}
      </View>

      <View style={tw`px-4 flex-row flex-wrap`}>
        {cast ? <Pill text={`Avec : ${cast}`} /> : null}
      </View>

      <View style={tw`px-4 flex-row flex-wrap`}>
        {genres ? <Pill text={`Genre : ${genres}`} /> : null}
        {movie.version ? <Pill text={`Version : ${movie.version}`} /> : null}
      </View>

      <View style={tw`h-6`} />
    </View>
  );
}

function EventTrailer({ youtubeUrl }: { youtubeUrl?: string }) {
  if (!youtubeUrl) return null;

  return (
    <View style={tw`mt-6 px-4 pb-10`}>
      <Pressable
        onPress={() => Linking.openURL(youtubeUrl)}
        style={({ pressed }) =>
          tw`w-full h-44 rounded-2xl overflow-hidden bg-slate-900 items-center justify-center ${
            pressed ? "opacity-90" : "opacity-100"
          }`
        }
      >
        <View style={tw`w-14 h-14 rounded-full bg-black/40 items-center justify-center`}>
          <Ionicons name="play" size={28} color="#fff" />
        </View>
        <Text style={tw`mt-2 text-white text-xs font-semibold`}>
          Bande-annonce
        </Text>
        <Text style={tw`mt-1 text-slate-300 text-[11px]`}>
          (ouvre YouTube)
        </Text>
      </Pressable>
    </View>
  );
}

export default function GrindhouseReadOneScreen() {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();
  const [addedToPlanning, setAddedToPlanning] = useState(false);

  const moviesById = useMemo(() => {
    const list = (moviesData as any).movies ?? [];
    return new Map<number, Movie>(list.map((m: any) => [m.id, normalizeMovie(m)]));
  }, []);

  const event: GrindhouseEvent | undefined = useMemo(() => {
    const root: any = eventsData as any;
    const list: GrindhouseEvent[] = root.neighborhood_events ?? root.grindhouse_events ?? [];
    const idNum = Number(eventId);
    return list.find((e) => e.id === idNum);
  }, [eventId]);

  const movies = useMemo(() => {
    if (!event?.movie_ids) return [];
    const m1 = moviesById.get(event.movie_ids[0]);
    const m2 = moviesById.get(event.movie_ids[1]);
    return [m1, m2].filter(Boolean) as Movie[];
  }, [event, moviesById]);

  const [pageIndex, setPageIndex] = useState(0);
  const listRef = useRef<FlatList<Movie>>(null);

  const { width } = Dimensions.get("window");

  // Vérifier si l'événement est dans le planning
  useEffect(() => {
    checkIfInPlanning();
  }, [eventId]);

  const checkIfInPlanning = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const planning = new Set(JSON.parse(stored));
        const eventKey = `grindhouse:${eventId}`;
        setAddedToPlanning(planning.has(eventKey));
      }
    } catch (error) {
      console.error("Erreur lecture planning:", error);
    }
  };

  const togglePlanning = async () => {
    try {
      const eventKey = `grindhouse:${eventId}`;
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const planning = stored ? new Set(JSON.parse(stored)) : new Set<string>();

      if (planning.has(eventKey)) {
        planning.delete(eventKey);
        setAddedToPlanning(false);
      } else {
        planning.add(eventKey);
        setAddedToPlanning(true);
      }

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(planning))
      );
    } catch (error) {
      console.error("Erreur sauvegarde planning:", error);
    }
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / width);
    setPageIndex(Math.min(Math.max(idx, 0), Math.max(movies.length - 1, 0)));
  };

  if (!event) {
    return (
      <View style={tw`flex-1 bg-white px-4 pt-10`}>
        <Pressable onPress={() => router.back()} style={tw`flex-row items-center`}>
          <Ionicons name="chevron-back" size={22} color="#0f172a" />
          <Text style={tw`ml-1 text-slate-900 font-semibold`}>Retour</Text>
        </Pressable>

        <Text style={tw`mt-6 text-slate-900 font-bold text-lg`}>Évènement introuvable</Text>
        <Text style={tw`mt-2 text-slate-600`}>Impossible de trouver l'évènement #{String(eventId)}.</Text>
      </View>
    );
  }

  const badgeLabel = formatEventBadge(event.start_at);
  const title = event.title ?? event.name ?? "Soirée cinéma";
  const priceLabel = `${event.price} ${event.currency ?? "€"}`;
  
  // Vérifier si l'événement est futur
  const isFutureEvent = new Date(event.start_at).getTime() > Date.now();

  return (
    <ScrollView style={tw`flex-1 bg-white`} showsVerticalScrollIndicator={false}>
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
            <Text style={tw`text-lg font-bold text-slate-900`}>Cinéma de quartier</Text>
            <Text style={tw`text-slate-500 text-xs`}>Évènement</Text>
          </View>
        </View>
      </View>

      {/* Hero */}
      <View style={tw`mt-2 px-4`}>
        <View style={tw`w-full h-40 rounded-2xl overflow-hidden bg-slate-200`}>
          {event.background_image_url ? (
            <Image
              source={{ uri: event.background_image_url }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : null}
        </View>
      </View>

      {/* Badge date */}
      <View style={tw`mt-3 px-4`}>
        <View style={tw`self-start px-3 py-1 rounded-full bg-orange-600`}>
          <Text style={tw`text-white text-xs font-bold`}>{badgeLabel}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={tw`mt-3 px-4 text-slate-900 font-extrabold text-xl`}>{title}</Text>

      {/* Place + price */}
      <View style={tw`mt-3 px-4`}>
        <View style={tw`flex-row items-center`}>
          <Ionicons name="location-outline" size={16} color="#94a3b8" />
          <Text style={tw`ml-2 text-slate-500 text-sm`}>{event.place}</Text>
        </View>

        <View style={tw`mt-2 flex-row items-center`}>
          <Ionicons name="pricetag-outline" size={16} color="#94a3b8" />
          <Text style={tw`ml-2 text-slate-500 text-sm`}>{priceLabel}</Text>
        </View>
      </View>

      {/* Boutons - seulement si événement futur */}
      {isFutureEvent && (
        <View style={tw`mt-4 px-4`}>
          {/* Billetterie */}
          <Pressable
            onPress={() => {
              if (event.ticketing_url) Linking.openURL(event.ticketing_url);
            }}
            style={({ pressed }) =>
              tw`w-full py-3.5 rounded-xl items-center justify-center flex-row ${
                pressed ? "bg-orange-700" : "bg-orange-600"
              }`
            }
          >
            <Ionicons name="ticket-outline" size={20} color="#fff" />
            <Text style={tw`ml-2 text-white font-bold text-base`}>Billetterie</Text>
          </Pressable>

          {/* Planning */}
          <Pressable
            onPress={togglePlanning}
            style={({ pressed }) =>
              tw`w-full mt-3 py-3.5 rounded-xl flex-row items-center justify-center ${
                addedToPlanning
                  ? pressed
                    ? "bg-slate-700"
                    : "bg-slate-800"
                  : pressed
                  ? "bg-slate-600"
                  : "bg-slate-700"
              }`
            }
          >
            <Ionicons
              name={addedToPlanning ? "checkmark-circle" : "add-circle"}
              size={22}
              color="white"
            />
            <Text style={tw`ml-2 text-white font-bold text-base`}>
              {addedToPlanning ? "Dans mon planning" : "Ajouter au planning"}
            </Text>
          </Pressable>
        </View>
      )}

      {/* Dark section: Carousel + dots + trailer */}
      <View style={tw`mt-6 bg-slate-950`}>
        {/* Carousel */}
        <FlatList
          ref={listRef}
          data={movies}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(m) => String(m.id)}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <MovieCarouselPage movie={item} />
            </View>
          )}
        />

        {/* Dots */}
        <View style={tw`pb-2`}>
          <View style={tw`flex-row justify-center items-center`}>
            {movies.map((_, idx) => (
              <Pressable
                key={idx}
                onPress={() => {
                  listRef.current?.scrollToOffset({ offset: idx * width, animated: true });
                  setPageIndex(idx);
                }}
                style={tw`mx-1`}
              >
                <View
                  style={tw`w-2 h-2 rounded-full ${
                    idx === pageIndex ? "bg-slate-200" : "bg-slate-600"
                  }`}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <EventTrailer youtubeUrl={event.youtube_url} />
      </View>
    </ScrollView>
  );
}