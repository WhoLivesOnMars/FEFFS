import tw from 'twrnc';
import {View, Text} from "react-native";
import {Component} from "react";
import {EventCard} from "@/src/components/event/EventCard";
import {router} from "expo-router";

export class EventsOfTheYearSection extends Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={tw`mx-6 my-4`}>
                <Text style={tw`text-orange-500 font-extrabold uppercase mb-4`}>Évènements à l'année</Text>
                <View style={tw`flex flex-row justify-between`}>
                    <EventCard source={{uri: 'https://picsum.photos/200'}} title="Cinéma plein air" onPress={() => router.push("/(event)/summer_night")} />
                    <EventCard source={{uri: 'https://picsum.photos/200'}} title="Cinéma de quartier" onPress={() => router.push("/(event)/grindhouse")} />
                    <EventCard source={{uri: 'https://picsum.photos/200'}} title="Palmarès" onPress={() => router.push("/(event)/winners")} />
                </View>
            </View>
        );
    }
}