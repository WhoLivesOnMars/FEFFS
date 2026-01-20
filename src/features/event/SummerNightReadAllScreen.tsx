import { Component } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  FlatList,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/summer-night-events.json";

type Movie = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  original_release_date?: string;
  duration?: string;
  directors?: string[];
  main_cast?: string[];
  genres?: string[];
  versions?: string[];
};

type SummerNightEvent = {
  id: number;
  movie_id: number;
  year?: number;
  place: string;
  target_audience?: string;
  screening_datetime: string;
  practical_info?: string[];
  accessibility?: string[];
};

function formatDateBadge(iso: string) {
  const d = new Date(iso);
  const dateLabel = d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
  const timeLabel = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  // "ven. 04 juillet · 21:30" -> "ven. 04 juillet · 21h30"
  return `${dateLabel} · ${timeLabel.replace(":", "h")}`;
}

function yearFromIso(iso: string) {
  const d = new Date(iso);
  return String(d.getFullYear());
}

function chip(text: string) {
  return (
    <View style={tw`px-3 py-2 rounded-full bg-slate-100 mr-2 mb-2`}>
      <Text style={tw`text-slate-700 text-xs font-semibold`}>{text}</Text>
    </View>
  );
}

function sectionTitle(title: string) {
  return (
    <View style={tw`mt-5`}>
      <Text style={tw`px-4 text-slate-900 font-extrabold tracking-wider text-xs`}>
        {title}
      </Text>
      <View style={tw`mt-3 h-px bg-slate-100`} />
    </View>
  );
}

function infoRow(leftIcon: any, label: string) {
  return (
    <View style={tw`flex-row items-center`}>
      <Ionicons name={leftIcon} size={14} color="#64748b" />
      <Text style={tw`ml-2 text-slate-600 text-xs`}>{label}</Text>
    </View>
  );
}

export class SummerNightReadOneScreen extends Component<
  {},
  { addedToPlanning: boolean }
> {
  constructor(props: {}) {
    super(props);
    this.state = { addedToPlanning: false };
  }

  render() {
    // ✅ Pour l’instant : premier event (plus tard => id en param)
    const event: SummerNightEvent = (eventsData as any).summer_night_events[0];

    const movie: Movie | undefined = (moviesData as any).movies.find(
      (m: Movie) => m.id === event.movie_id
    );

    const imageUrl = movie?.image_url;
    const badgeLabel = formatDateBadge(event.screening_datetime);

    const title = `Projection plein air : "${movie?.name ?? "Film"}"`;
    const place = event.place;
    const audience = event.target_audience ?? "Tout public";

    const synopsis =
      movie?.description ??
      "Synopsis à venir. Revenez bientôt pour découvrir plus d’informations sur ce film.";

    // Fiche technique (mock + données existantes)
    const ficheTech = [
      { left: "calendar-outline", right: yearFromIso(event.screening_datetime) },
      { left: "time-outline", right: movie?.duration ?? "—" },
      {
        left: "person-outline",
        right: movie?.directors?.length
          ? `Réalisation : ${movie.directors.join(", ")}`
          : "Réalisation : —",
      },
    ];

    const castingLine =
      movie?.main_cast?.length ? `Avec : ${movie.main_cast.join(", ")}` : null;

    const genresLine =
      movie?.genres?.length ? `Genre : ${movie.genres.join(", ")}` : null;

    const versionLine =
      movie?.versions?.length ? `Version : ${movie.versions.join(" · ")}` : null;

    const practical = event.practical_info?.length
      ? event.practical_info
      : ["Ouverture des portes 30 min avant", "Prévoir une veste", "Buvette sur place"];

    const accessibility = event.accessibility?.length
      ? event.accessibility
      : ["Accès PMR", "Zone réservée fauteuils roulants", "Toilettes accessibles"];

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
              <Text style={tw`text-base font-bold text-slate-900`}>
                Cinéma en plein air
              </Text>
              <Text style={tw`text-slate-500 text-xs`}>Évènement</Text>
            </View>
          </View>
        </View>

        {/* CONTENT */}
        <ScrollView contentContainerStyle={tw`pb-8`}>
          <View style={tw`px-4 pt-3`}>
            {/* HERO */}
            <View style={tw`rounded-2xl overflow-hidden`}>
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={tw`w-full h-48`}
                  resizeMode="cover"
                />
              ) : (
                <View style={tw`w-full h-48 bg-slate-200`} />
              )}
            </View>

            {/* Badge date */}
            <View style={tw`mt-3 self-start bg-orange-600 px-3 py-2 rounded-full`}>
              <Text style={tw`text-white font-semibold text-xs`}>{badgeLabel}</Text>
            </View>

            {/* Title */}
            <Text style={tw`mt-4 text-slate-900 font-extrabold text-lg`}>
              {title}
            </Text>

            {/* Place */}
            <View style={tw`mt-3 flex-row items-center`}>
              <Ionicons name="location-outline" size={16} color="#64748b" />
              <Text style={tw`ml-2 text-slate-500 text-sm`}>{place}</Text>
            </View>

            {/* Audience */}
            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons name="people-outline" size={16} color="#64748b" />
              <Text style={tw`ml-2 text-slate-500 text-sm`}>{audience}</Text>
            </View>

            {/* Button */}
            <View style={tw`mt-4`}>
              <Pressable
                onPress={() =>
                  this.setState({ addedToPlanning: !this.state.addedToPlanning })
                }
                style={({ pressed }) =>
                  tw`w-full py-4 rounded-2xl items-center ${
                    pressed ? "bg-orange-700" : "bg-orange-600"
                  }`
                }
              >
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="calendar-outline" size={18} color="#ffffff" />
                  <Text style={tw`ml-2 text-white font-bold`}>
                    {this.state.addedToPlanning
                      ? "Ajouté au planning"
                      : "Ajouter au planning"}
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

          {/* SYNOPSIS */}
          {sectionTitle("SYNOPSIS")}
          <View style={tw`px-4 pt-4`}>
            <Text style={tw`text-slate-700 leading-5`}>{synopsis}</Text>
          </View>

          {/* FICHE TECHNIQUE */}
          {sectionTitle("FICHE TECHNIQUE")}
          <View style={tw`px-4 pt-4`}>
            <View style={tw`flex-row flex-wrap`}>
              {yearFromIso(event.screening_datetime) ? chip(yearFromIso(event.screening_datetime)) : null}
              {movie?.duration ? chip(movie.duration) : null}
            </View>

            <View style={tw`mt-2`}>
              {ficheTech.map((row, idx) => (
                <View key={idx} style={tw`mt-2`}>
                  {infoRow(row.left, row.right)}
                </View>
              ))}
              {castingLine ? (
                <View style={tw`mt-2`}>{infoRow("people-outline", castingLine)}</View>
              ) : null}
              {genresLine ? (
                <View style={tw`mt-2`}>{infoRow("pricetag-outline", genresLine)}</View>
              ) : null}
              {versionLine ? (
                <View style={tw`mt-2`}>{infoRow("film-outline", versionLine)}</View>
              ) : null}
            </View>
          </View>

          {/* INFOS PRATIQUES */}
          {sectionTitle("INFOS PRATIQUES")}
          <View style={tw`px-4 pt-4`}>
            {practical.map((line, idx) => (
              <View key={idx} style={tw`flex-row items-start mt-2`}>
                <View style={tw`mt-1 mr-2 w-2 h-2 rounded-full bg-slate-300`} />
                <Text style={tw`text-slate-700 flex-1`}>{line}</Text>
              </View>
            ))}
          </View>

          {/* ACCESSIBILITÉ */}
          {sectionTitle("ACCESSIBILITÉ")}
          <View style={tw`px-4 pt-4`}>
            {accessibility.map((line, idx) => (
              <View key={idx} style={tw`flex-row items-start mt-2`}>
                <View style={tw`mt-1 mr-2 w-2 h-2 rounded-full bg-slate-300`} />
                <Text style={tw`text-slate-700 flex-1`}>{line}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}
